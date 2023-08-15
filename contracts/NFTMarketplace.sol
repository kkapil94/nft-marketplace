// SPDX-License-Identifier: UNLICENSE
pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFTMarketplace is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    Counters.Counter private _itemSold;
    address payable owner;
    uint256 listPrice = 0.01 ether;

    struct ListedToken {
        uint tokenId;
        address payable owner;
        address payable seller;
        uint256 price;
        bool currentlyListed;
    }

    event TokenListedSuccess(
        uint256 indexed tokenId,
        address owner,
        address seller,
        uint256 price,
        bool currentlyListed
        );

    mapping (uint256 => ListedToken) private idToListedToken;

    constructor() ERC721("Beast","BST"){
        owner = payable(msg.sender);
    }

    function createToken(string memory tokenURI, uint256 price) public payable returns (uint) {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        _safeMint(msg.sender,newTokenId);
        _setTokenURI(newTokenId,tokenURI);
        createListedToken(newTokenId,price);

        return newTokenId;
    }

    function createListedToken(uint256 tokenId,uint price) private {
        require(msg.value>listPrice,"price should be more than list price");
        idToListedToken[tokenId] = ListedToken(
            tokenId,
            payable(address(this)),
            payable(msg.sender),
            price,
            true
        );
        _transfer(msg.sender,address(this),tokenId);

        emit TokenListedSuccess(tokenId,address(this),msg.sender,price,true);
    }

    function getAllNFTs()public view returns (ListedToken[] memory) {
        uint256  nftCount = _tokenIds.current();
        ListedToken[] memory tokens = new ListedToken[](nftCount); 

        for (uint i = 0; i < nftCount; i++) {
            ListedToken storage token = idToListedToken[i+1];
            tokens[i] = token;
        }
        return tokens;
    }

    function getMyNFTs()public view returns(ListedToken[] memory){
        uint256 allnftCount = _tokenIds.current();
        uint256 myNFTCount = 0;

        for (uint i = 0; i < allnftCount; i++) {
            if (idToListedToken[i+1].owner == msg.sender || idToListedToken[i+1].seller == msg.sender) {
                myNFTCount++;
            }
        }
        ListedToken[] memory myTokens = new  ListedToken[](myNFTCount);

        for (uint i = 0; i < myNFTCount; i++) {
            if (idToListedToken[i+1].owner == msg.sender || idToListedToken[i+1].seller == msg.sender) {
                myTokens[i] = idToListedToken[i+1];
            }
        }
        return myTokens;
    }

    function executeSale(uint256 tokenId) public payable {
        address seller = idToListedToken[tokenId].seller;
        require(idToListedToken[tokenId].price == msg.value,"the amount should be equal the price");
        idToListedToken[tokenId].currentlyListed = true;
        idToListedToken[tokenId].seller = payable(msg.sender);
        _itemSold.increment();

        _transfer(address(this),msg.sender,tokenId);
        approve(address(this),tokenId);
        payable(owner).transfer(listPrice);
        payable(seller).transfer(msg.value);
    }

        function updateListPrice(uint256 _listPrice) public payable {
        require(owner == msg.sender, "Only owner can update listing price");
        listPrice = _listPrice;
    }

    function getListPrice() public view returns (uint256) {
        return listPrice;
    }

    function getLatestIdToListedToken() public view returns (ListedToken memory) {
        uint256 currentTokenId = _tokenIds.current();
        return idToListedToken[currentTokenId];
    }

    function getListedTokenForId(uint256 tokenId) public view returns (ListedToken memory) {
        return idToListedToken[tokenId];
    }

    function getCurrentToken() public view returns (uint256) {
        return _tokenIds.current();
    }

}

