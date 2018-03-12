pragma solidity ^0.4.20;

contract RatingList {
    struct Rating {
        uint id;
        uint stars;
        string review;
    }
    
    uint public ratingIdCounter;
    mapping(address => mapping(bytes32 => Rating)) public ratings;
    
    function rate(string txHash, uint stars, string review) public {
        bytes32 key = keccak256(txHash);
        Rating storage rating = ratings[msg.sender][key];
        
        require(stars >= 1 && stars <= 5);
        require(bytes(review).length <= 5000);
        
        rating.id = ++ratingIdCounter;
        rating.stars = min(stars, 5);
        rating.review = review;
    }
    
    function getRating(address sender, string txHash) view public returns (uint id, uint stars, string review) {
        bytes32 key = keccak256(txHash);
        Rating storage rating = ratings[sender][key];
        
        id = rating.id;
        stars = rating.stars;
        review = rating.review;
    }

    function min(uint a, uint b) pure public returns (uint _min) {
        if (a > b)
            return b;
        else
            return a;
    }
    
    function divCeil(uint a, uint b) pure public returns (uint result) {
        result = a / b;
        if ((result * b) < a) {
            result++;
        }
    }
}