// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Locker is Ownable {
    using SafeMath for uint256;

    //CR#102 add bnbfee
    uint256 public bnbFee = 50000000000000000;
    uint256 public totalBnbFees = 0;

    struct ReleaseCheckpoint {
        uint256 tokensCount;
        uint256 releaseTargetTimestamp;
        bool claimed;
    }

    struct VestedTokenVault {
        address tokenAddress;
        //ETH for ethereum, BNB for BSC, AVAX for AVA c-chain
        bool nativeToken;
        ReleaseCheckpoint[] checkpoints;
    }

    struct UserLocks {
        VestedTokenVault[] userVaults;
    }

    //every user has multiple vaults: he can store any token with different release schedules.
    //Token might be duplicated, e.g. 
    //Vault1: USDC with 6 months lock + Vault2: USDC with 12 months lock + Vault3: DAI with custom schedule
    mapping(address => UserLocks) userLocks;

    
    //tokens fee 
    address[] tokenAddressesWithFees;
    mapping(address => uint256) public tokensFees;

    //CR#102 add bnbfee
    //make method payable

    function lock(
        uint256 targetTimestamp,
        address tokenContract,
        uint256 tokenCount
    ) external payable returns (uint256) {
        require(targetTimestamp > block.timestamp, "Date in the past selected");
        require(tokenCount > 0, "Token count must be positive number");
        require(tokenContract != address(0), "Token contract is null");

        //CR#102 add bnbfee
        require(msg.value > bnbFee, 'BNB fee not provided');

        //push new element to user's vault and get it's index
        userLocks[msg.sender].userVaults.push();
        uint256 vaultIndex = userLocks[msg.sender].userVaults.length - 1;

        //create release checkpoint to created vault
        userLocks[msg.sender].userVaults[vaultIndex].checkpoints.push();

        //get created user Vault by index
        VestedTokenVault storage targetVault = userLocks[msg.sender].userVaults[
            vaultIndex
        ];

        //get checkpoint, in this this case here will be only one element
        ReleaseCheckpoint storage checkpoint = targetVault.checkpoints[0];


        //calc fee percent
        // base 10000, 0.35% = value * 35 / 10000
        uint256 lpFeePercent = 35;

        //calc fee and lock amount
        uint256 fee = tokenCount.mul(lpFeePercent).div(10000);
        uint256 lockAmount = tokenCount.sub(fee);

        //fill input data
        targetVault.tokenAddress = tokenContract;
        targetVault.nativeToken = false;

        // save amount of locked token
        checkpoint.tokensCount = lockAmount;

        checkpoint.releaseTargetTimestamp = targetTimestamp;
        checkpoint.claimed = false;

        //transfer token to vault
        try
            IERC20(tokenContract).transferFrom(
                msg.sender,
                address(this),
                tokenCount
            )
        returns (bool) {

            //save the fee amount in token fee address
            address _tokenAddress = tokenContract;

            if (tokensFees[_tokenAddress] == 0) {
                tokenAddressesWithFees.push(_tokenAddress);
            }
            tokensFees[_tokenAddress] = tokensFees[_tokenAddress].add(fee);
            
            //CR#102 add bnbfee
            //Add the fee to current total fee            
            totalBnbFees = totalBnbFees.add(msg.value);
            
            return vaultIndex;
        } catch (bytes memory) {
            revert("Not an ERC20 token");
        }
    }

    function lockNativeCurrency(uint256 targetTimestamp) external payable {
        require(targetTimestamp > block.timestamp, "Date in the past selected");

        //push new element to user's vault and get it's index
        userLocks[msg.sender].userVaults.push();
        uint256 vaultIndex = userLocks[msg.sender].userVaults.length - 1;

        //create release checkpoint to created vault
        userLocks[msg.sender].userVaults[vaultIndex].checkpoints.push();

        //get created user Vault by index
        VestedTokenVault storage targetVault = userLocks[msg.sender].userVaults[
            vaultIndex
        ];

        //get checkpoint, in this this case here will be only one element
        ReleaseCheckpoint storage checkpoint = targetVault.checkpoints[0];

        targetVault.nativeToken = true;
        checkpoint.tokensCount = msg.value;
        checkpoint.releaseTargetTimestamp = targetTimestamp;
        checkpoint.claimed = false;
    }

    // function lockWithLinearRelease(
    //     uint256 targetBlockRelease,
    //     address tokenContract,
    //     uint256 tokenCount,
    //     int16 checkpoints
    // ) public {}

    // function lockWithScheduledRelease(
    //     address tokenContract,
    //     bytes32[] memory checkpoints
    // ) public {}

    // function claimAll() public {}

    // function claimToken(address token) public {}

    function claimByVaultId(uint256 vaultId) external payable returns (bool) {
        require(vaultId >= 0, "vaultId should be positive");

        VestedTokenVault storage vault = userLocks[msg.sender].userVaults[
            vaultId
        ];
        ReleaseCheckpoint storage checkpoint = vault.checkpoints[0];

        require(checkpoint.claimed == false, "Already claimed");
        require(
            checkpoint.releaseTargetTimestamp <= block.timestamp,
            "Cannot claim before target date"
        );

        if (vault.nativeToken) {
            payable(msg.sender).transfer(
                vault.checkpoints[0].tokensCount
            );
            checkpoint.claimed = true;
            return true;
        } else {
            try
                IERC20(vault.tokenAddress).transfer(
                    msg.sender,
                    checkpoint.tokensCount
                )
            returns (bool) {
                checkpoint.claimed = true;
                return true;
            } catch (bytes memory) {
                revert("Transfer error");
            }
        }
    }

    function getUserVaults(address userAddress)
        public
        view
        returns (UserLocks memory)
    {
        return userLocks[userAddress];
    }


    //Withdraw the fee from admin
    function withdrawFees(address payable withdrawalAddress) external onlyOwner {
        //CR#102 add bnbfee
        //transfer fee to owner wallet
        if (totalBnbFees > 0) {
            withdrawalAddress.transfer(totalBnbFees);
            totalBnbFees = 0;
        }

        for (uint i = 1; i <= tokenAddressesWithFees.length; i++) {
            address tokenAddress = tokenAddressesWithFees[tokenAddressesWithFees.length - i];
            uint256 amount = tokensFees[tokenAddress];
            if (amount > 0) {
                IERC20(tokenAddress).transfer(withdrawalAddress, amount);
            }
            delete tokensFees[tokenAddress];
            tokenAddressesWithFees.pop();
        }

        tokenAddressesWithFees = new address[](0);
    }    
}
