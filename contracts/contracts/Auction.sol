// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;
import "@tableland/evm/contracts/ITablelandTables.sol";
import "@tableland/evm/contracts/utils/TablelandDeployments.sol";
import "@tableland/evm/contracts/ITablelandController.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./utils/SQLHelpers.sol";

contract Auction {
    using Counters for Counters.Counter;
    Counters.Counter private tokenID;
    address public owner;
    string  private _baseURIString;

    ITablelandTables private tablelandContract;

    mapping(string => address) private productMap;

    string  private mainTable;
    uint256 private mainTableID;
    string private constant MAIN_TABLE_PREFIX = "product_list";
    string private constant MAIN_SCHEMA = "tokenID text, description text, image text, name text, basePrice text, startDate text, endDate text, owner text";

    string  private historyTable;
    uint256 private historyTableID;
    string private constant HISTORY_TABLE_PREFIX = "product_history";
    string private constant HISTORY_SCHEMA = "tokenID text, bidPrice text, time text, bidder text";

    string  private purchaseTable;
    uint256 private purchaseTableID;
    string private constant PURCHASE_TABLE_PREFIX = "product_purchase";
    string private constant PURCHASE_SCHEMA = "tokenID text, buyer text, price text, date text";

    constructor() {
        _baseURIString = "https://testnet.tableland.network/query?s=";
        tablelandContract = TablelandDeployments.get();

        mainTableID = tablelandContract.createTable(
            address(this),
            SQLHelpers.toCreateFromSchema(MAIN_SCHEMA  , MAIN_TABLE_PREFIX)
        );

        mainTable = SQLHelpers.toNameFromId(MAIN_TABLE_PREFIX, mainTableID);
        
        historyTableID = tablelandContract.createTable(
            address(this),
            SQLHelpers.toCreateFromSchema(HISTORY_SCHEMA, HISTORY_TABLE_PREFIX)
        );

        historyTable = SQLHelpers.toNameFromId(HISTORY_TABLE_PREFIX, historyTableID);


        purchaseTableID = tablelandContract.createTable(
            address(this),
            SQLHelpers.toCreateFromSchema(PURCHASE_SCHEMA, PURCHASE_TABLE_PREFIX)
        );

        purchaseTable = SQLHelpers.toNameFromId(PURCHASE_TABLE_PREFIX, purchaseTableID);
    }

    function list_product(string memory name , string memory description , string memory image, string memory base_price, string memory start_date, string memory end_date) public  {        
        tokenID.increment();

        productMap[Strings.toString(tokenID.current())] = msg.sender;
        
        string memory insert_statement =
        SQLHelpers.toInsert(
                MAIN_TABLE_PREFIX,
                mainTableID,
                // "tokenID text, description text, image text, name text, basePrice text, startDate text, endDate text, owner text"
                "tokenID, description, image, name, basePrice, startDate, endDate, owner",
                string.concat(
                    SQLHelpers.quote(Strings.toString(tokenID.current())),
                    ",",
                    SQLHelpers.quote(description),
                    ",",
                    SQLHelpers.quote(image),
                    ",",
                    SQLHelpers.quote(name),
                    ",",
                    SQLHelpers.quote(base_price),
                    ",",
                    SQLHelpers.quote(start_date),
                    ",",
                    SQLHelpers.quote(end_date),
                    ",",
                    SQLHelpers.quote(Strings.toHexString(msg.sender))
                    
                )
        );
        runSQL(mainTableID,insert_statement);
    }
    
    
    function bid(string memory _tokenID , string memory bid_price , string memory time) public  {        
        require(productMap[_tokenID] != address(0), "Product not listed");
        
        string memory insert_statement =
        SQLHelpers.toInsert(
                HISTORY_TABLE_PREFIX,
                historyTableID,
                // "tokenID text, bidPrice text, time text, bidder text"
                "tokenID, bidPrice, time, bidder",
                string.concat(
                    SQLHelpers.quote(_tokenID),
                    ",",
                    SQLHelpers.quote(bid_price),
                    ",",
                    SQLHelpers.quote(time),
                    ",",
                    SQLHelpers.quote(Strings.toHexString(msg.sender))
                )
        );
        runSQL(historyTableID,insert_statement);
    }

    function purchase(string memory _tokenID , string memory sell_price , string memory time) public  {        
        require(productMap[_tokenID] != address(0), "Product not listed");
        
        string memory insert_statement =
        SQLHelpers.toInsert(
                PURCHASE_TABLE_PREFIX,
                purchaseTableID,
                // "tokenID text, buyer text, price text, date text"
                "tokenID, buyer, price, date",
                string.concat(
                    SQLHelpers.quote(_tokenID),
                    ",",
                    SQLHelpers.quote(Strings.toHexString(msg.sender)),
                    ",",
                    SQLHelpers.quote(sell_price),
                    ",",
                    SQLHelpers.quote(time)
                )
        );
        runSQL(purchaseTableID,insert_statement);
    }

    // Function to make Insertions , Updates and Deletions to our Tableland Tables 
    /// @notice Function to make Insertions , Updates and Deletions to our Tableland Tables 
    /// @dev retrieves the value of the tableID and the statement to execute on the table 
    function runSQL(uint256 tableID, string memory statement) private{
         tablelandContract.runSQL(
            address(this),
            tableID,
            statement        
        );
    }


    // @return of the tableland gateway prefix link 
    function tableURI() internal view returns (string memory) {
        return _baseURIString;
    }

    // @dev returns the link to fetch all the data inside the main nft table
    function mainTableURI() 
    public view returns (string memory) {
        return string.concat(
            tableURI(), 
            "SELECT%20*%20FROM%20",
            mainTable
        );
    }
    
    // @dev returns the link to fetch all the data inside the main nft table
    function historyTableURI() 
    public view returns (string memory) {
        return string.concat(
            tableURI(), 
            "SELECT%20*%20FROM%20",
            historyTable
        );
    }
    
    // @dev returns the link to fetch all the data inside the main nft table
    function purchaseTableURI() 
    public view returns (string memory) {
        return string.concat(
            tableURI(), 
            "SELECT%20*%20FROM%20",
            purchaseTable
        );
    }
}