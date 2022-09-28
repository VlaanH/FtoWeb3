function FtoWeb3V9Get() 
{
    var versionObj = new VersionSmartContractObj();

    versionObj.CONTRACT_ADDRESS = '0xF46068Fcd98BD1dD8e8008d83BBbe97F9e33fc92';
    versionObj.ABI = [{"inputs":[],"stateMutability":"payable","type":"constructor"},{"inputs":[{"internalType":"string","name":"id","type":"string"},{"internalType":"string","name":"base64Data","type":"string"},{"internalType":"uint256","name":"partId","type":"uint256"}],"name":"AddFile","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"string","name":"id","type":"string"},{"internalType":"string","name":"fileName","type":"string"},{"internalType":"uint256","name":"BlockSize","type":"uint256"}],"name":"CreateFile","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"string","name":"id","type":"string"}],"name":"FileExist","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"id","type":"string"}],"name":"getBlockSize","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"id","type":"string"}],"name":"getFile","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"id","type":"string"}],"name":"getFileName","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"id","type":"string"}],"name":"getFileSize","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address payable","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"versions","outputs":[{"internalType":"int256","name":"","type":"int256"}],"stateMutability":"view","type":"function"}];
    
    return versionObj;
}