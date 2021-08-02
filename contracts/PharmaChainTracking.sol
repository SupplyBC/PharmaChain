// "SPDX-License-Identifier: UNLICENSED"

pragma solidity >=0.6.2;
pragma experimental ABIEncoderV2;  
import './PharmaChain.sol';

contract PharmaChainTracking {
    
    
    uint        tempThreshold = 40;
    uint        humidityThreshold = 50;
    uint[]      tempArr;
    uint[]      humidArr;
    Log[]       logsArr;
    address     pcContract;
    PharmaChain pc;
    mapping (uint => Log[])                 trackLogs; //requestId and Log
    mapping (uint => uint[])                tempDataLogs; // requestId and temp data
    mapping (uint => uint[])                humidDataLogs; // requestId and humid data
    mapping (uint => Location[])            requestLocations; //request id and locations
    mapping (uint => string)                requestShipmentMethod; //request Id and shipment method  
    event   DataSent            (uint indexed requestNo, string DataCategory ,uint tempValues , uint HumidValues , uint indexed timestamp);
    event   ShipmentStateUpdate (uint indexed requestNo, string  state, uint indexed timestamp);
    
     struct Product {
        
        address manufacturer;
        string  productId; //registration no.
        string  productName;
        string  productForm; // tablets or capsules
        uint    productBudget;
        
    }
    
    struct Location {
        string Latitude;
        string Longitude;
    }
    struct Log {
        address logger;
        string  requestStatus;
        string  description;
        string  shipmentStatus;
        uint    logTime;
    }
    
  
  function returnContractAddress() public view returns (address) {
        return address(this);
    }
    
    
    function setContract(address _contract) public {
        pcContract = _contract;
        pc = PharmaChain(pcContract);
    }
    
    
     // TRACKING STUFF GOES HERE
    // TRACKING STEPS:
    // 1- REQUEST IS CREATED
    // 2- SUPPLIER APPROVE REQUEST AND ASSIGNS SHIPMENT LOCATION 
    // 3- SUPPLIER CREATE AND SEND SHIPMENT FOR GLOBAL TRANSMISSION
    // 4- GLOBAL TRANSMISSION SHIPS PACKAGE FOR LOCAL TRANSMISSION
    // 5- LOCAL TRANSMISSION SHIPS PACKAGE TO FINAL DESTINATION (MANUFACTURER)
    // TEMP AND HUMIDITY READINGS ARE SET DURING ALL PHASES OF SHIPMENT TRANSMISSION.
    

    //supplier
    function approveRequest(uint _requestId, uint _totalPayment) public {
        createLog(_requestId, 'REQUEST APPROVED', 'NORMAL' , 'YOUR REQUEST IS BEING PROCESSED.' );
        
        // uint payment = pc.getRequestCost(_requestId)/2;
        uint payment = _totalPayment/2;
        pc.transfer(pc.getRequestById(_requestId).fromParti, msg.sender, payment);
        pc.emitRequestStateEvent('REQUEST APPROVED');
    }
    
 
    function verifyShipmentState(uint _id) public returns (string memory) {
        
        string memory status;
        
        if(tempArr[tempArr.length-1] >= tempThreshold || humidArr[humidArr.length-1] >= humidityThreshold) {
            
            status = 'ABNORMAL';
             emit ShipmentStateUpdate (_id, status , block.timestamp);
            
        } else {
            
            status = 'NORMAL';
             emit ShipmentStateUpdate (_id, status , block.timestamp);
        }
          return status;
    }
    
 
    // // supplier 
    function sendShipment(uint _requestId) public {
        // string memory x = pc.getInventoryItemById(pc.getRequestById(_requestId).materialID).itemId;
        // string memory y = pc.getRequestById(_requestId).materialID;
        // uint newAmount = pc.getInventoryItemById(pc.getRequestById(_requestId).materialID).amount - pc.getRequestById(_requestId).amount;

        string memory result = verifyShipmentState(_requestId);
    
        createLog(_requestId, 'PACKAGE CREATED',  result , 'PACKAGE IS CREATED AND SHIPMENT IS READY TO LEAVE FOR SHPPING.' );
        // emit pc.requestStateUpdate(msg.sender, block.timestamp , 'PACKAGE CREATED');
        pc.emitRequestStateEvent('PACKAGE CREATED');
        
        createLog (_requestId, 'OUT FOR SHIPPING', result , ' YOUR SHIPMENT IS OUT FOR SHIPPING'); 
        // emit pc.requestStateUpdate(msg.sender, block.timestamp , 'PACKAGE IS OUT FOR SHIPPING');
        pc.emitRequestStateEvent('PACKAGE IS OUT FOR SHIPPING');
        
        // if(pc.strComp(x,y)) {
        //     pc.updateInventory(msg.sender,pc.getRequestById(_requestId).materialID, newAmount);
        // }
        
    }
    
    // // global distributor
    function globalTransitShipment(uint _requestId) public {
        
        string memory result = verifyShipmentState(_requestId);
        
        createLog (_requestId, 'SHIPPING PACKAGE', result , ' YOUR SHIPMENT IS CURRENTLY IN TRANSIT.');
        // emit pc.requestStateUpdate(msg.sender, block.timestamp , 'IN GLOBAL TRANSIT');
        pc.emitRequestStateEvent('IN GLOBAL TRANSIT');
        
    }
    
    // //local distributor
    function localTransitShipment(uint _requestId) public {
        
         string memory result = verifyShipmentState(_requestId);
         
        createLog (_requestId, 'READY FOR DELIVERY', result , 'YOUR SHIPMENT IS SET FOR DELIVERY AND IS EXPECTED TO ARRIVE SOON.');
        // emit pc.requestStateUpdate(msg.sender, block.timestamp , 'IN LOCAL TRANSIT');
        pc.emitRequestStateEvent('IN LOCAL TRANSIT');
        
    }
     
    // //manufacturer
    
    function receiveShipment(uint _requestId, uint _totalPayment) public {
        // string memory x = pc.getInventory(msg.sender)[0].itemId;
        // string memory y = pc.getRequestById(_requestId).materialID;
        // uint newAmount = pc.getInventoryItemById(pc.getRequestById(_requestId).materialID).amount + pc.getRequestById(_requestId).amount;
        
        string memory result = verifyShipmentState(_requestId);
        createLog(_requestId, 'DELIVERED' , result , 'YOUR SHIPMENT IS DELIVERED SUCCESSFULLY.');
        pc.emitRequestStateEvent('SHIPMENT DELIVERED');
        
        // uint payment = pc.getRequestCost(_requestId) - pc.getRequestCost(_requestId)/2;
        uint payment = _totalPayment - _totalPayment/2;
        pc.transfer(pc.getRequestById(_requestId).fromParti, msg.sender, payment);
        
       
        // if(pc.strComp(x,y)) {
        //     pc.updateInventory(msg.sender,pc.getRequestById(_requestId).materialID, newAmount);
        // } else {
        //     pc.addToInventory(msg.sender,pc.getRequestById(_requestId).materialID, newAmount);
        // }
    }
    
    
    function createLog(
    uint _requestId,
    string memory _requestStatus,
    string memory _shipmentStatus,
    string memory _description
    
    ) public  {
        
        Log memory myLog = Log({
            logger: msg.sender,
            requestStatus: _requestStatus,
            shipmentStatus: _shipmentStatus,
            description: _description,
            logTime: block.timestamp
        });
        
        trackLogs[_requestId].push(myLog);
        // emit pc.requestStateUpdate(msg.sender, block.timestamp , _requestStatus);
        pc.emitRequestStateEvent(_requestStatus);
        logsArr.push(myLog);
     }
    
    function setShipmentTrackData (uint _id, uint _temp , uint _humid) public {
        
        tempDataLogs[_id].push(_temp);
        tempArr.push(_temp);
        humidDataLogs[_id].push(_humid);
        humidArr.push(_humid);
        emit DataSent(_id ,'Sensors Data', _temp, _humid , block.timestamp);
        if(_temp >= tempThreshold || _humid >= humidityThreshold) {
            emit ShipmentStateUpdate (_id, 'ABNORMAL' , block.timestamp);
        } else {
             emit ShipmentStateUpdate (_id, 'NORMAL' , block.timestamp);
        }
    }
    
    function getShipmentTrackData (uint _id) public view returns (uint[] memory temp, uint[] memory humid) {
        return (tempDataLogs[_id],humidDataLogs[_id]);
        
    }
    
    function getTrackLogs(uint _request) public view returns(Log[] memory) {
        return trackLogs[_request];
    }
    
    function getAllTrack() public view returns(Log[] memory) {
        return logsArr;
    }
    
    
    function setShipmentLocation (uint _id, string memory _lat , string memory _long) public {
        Location memory loc = Location({
            Latitude: _lat,
            Longitude: _long
        });
        
        requestLocations[_id].push(loc);
    }
    
    function getShipmentLocation (uint _id) public view returns (Location[] memory) {
        return requestLocations[_id];
    }
    
    function setShipmentMethod(uint _id , string memory _method) public {
        requestShipmentMethod[_id] = _method;
    }
    
    function getShipmentMethod(uint _id) public view returns (string memory) {
        return requestShipmentMethod[_id];
    }
    
    // END OF TRACKING STUFF
// END OF CONTRACT
}