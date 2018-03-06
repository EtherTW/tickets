pragma solidity ^0.4.18;


contract TEMTicket {
    uint256 constant public DEPOSIT = 0.03 ether;
    uint256 constant public MAX_ATTENDEE = 100;

    mapping (uint256 => address) public id2Addr;
    mapping (address => uint256) public userId;
    address public owner;
    address public TEMWallet;
    uint256 public attendRecord;
    uint256 public userAmount;
    bool public emergencyStop;

    function TEMTicket(address _TEMWallet) public {
        owner = msg.sender;
        TEMWallet = _TEMWallet;
        emergencyStop = false;
        userAmount = 0;
    }

    function () payable external {
        if (msg.value == 0) {
            getRefund();
  		} else {
            getTicket(msg.sender);
  		}
    }

    function getTicket (address _attendee) payable public {
        require(msg.value >= DEPOSIT && userId[_attendee] == 0);
        userAmount ++;
        require(userAmount <= MAX_ATTENDEE);
        userId[_attendee] = userAmount;
        id2Addr[userAmount] = _attendee;
        TEMWallet.transfer(msg.value - DEPOSIT);
    }

    function getRefund () public {	
        uint256 index = userId[msg.sender];
        require(index != 0);
        require(isAttend(index) || emergencyStop);
        userId[msg.sender] = 0;
        msg.sender.transfer(DEPOSIT);
    } 

    function isAttend (uint256 _index) view returns (bool) {
        return (16 ** _index) & attendRecord == (16 ** _index);
    }

    function setAttendBatch (uint256 _attendRecord) external {
        require(msg.sender == owner);
        attendRecord = _attendRecord;
    }

    function setAttendEach (uint256 _index) external {
        require(msg.sender == owner);
        attendRecord = attendRecord | (16 ** _index);
    }

    function transferOwner (address _owner) external {
        require (msg.sender == owner);
        owner = _owner;
    }

    function emergencyStop (bool _stop) external {
        require(msg.sender == owner);
        emergencyStop = _stop;
    }
}
