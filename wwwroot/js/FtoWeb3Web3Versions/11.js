class FtoWeb3V11 extends FtoWeb3V10
{
    constructor()
    {
        super();
        this.version = 11;
        this.CONTRACT_ADDRESS = '0xbb75a104a9873f98df4260adb62e5426951f48d0';
        this.ABI = [{"inputs":[],"stateMutability":"payable","type":"constructor"},{"inputs":[{"internalType":"string","name":"id","type":"string"},{"internalType":"string","name":"base64Data","type":"string"},{"internalType":"uint256","name":"partId","type":"uint256"}],"name":"AddFile","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"string","name":"id","type":"string"},{"internalType":"string","name":"fileName","type":"string"},{"internalType":"uint256","name":"blockSize","type":"uint256"},{"internalType":"uint256","name":"parts","type":"uint256"}],"name":"CreateFile","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"string","name":"id","type":"string"}],"name":"FileExist","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"id","type":"string"},{"internalType":"uint256","name":"part","type":"uint256"}],"name":"IsFilePartExist","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"id","type":"string"}],"name":"getBlockSize","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"id","type":"string"}],"name":"getFile","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"id","type":"string"}],"name":"getFileName","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"id","type":"string"}],"name":"getFileOwner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"id","type":"string"},{"internalType":"uint256","name":"part","type":"uint256"}],"name":"getFilePart","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"id","type":"string"}],"name":"getFileSize","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"id","type":"string"}],"name":"getJsonFileMap","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"getJsonUsersFiles","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"id","type":"string"}],"name":"getPartsLoaded","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address payable","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"versions","outputs":[{"internalType":"int256","name":"","type":"int256"}],"stateMutability":"view","type":"function"}]
        
        this.contract = new window.web3.eth.Contract(this.ABI, this.CONTRACT_ADDRESS);
    }
    
    async GetJsonFileMap(id)
    {
        let symbol='';
        let error;
        do
        {
            error = false;

            symbol = await this.contract.methods.getJsonFileMap(id).call().catch((e) =>
            {
                error = true;
                console.log(e)
            });

        }
        while (error===true || symbol===undefined)

        console.log(symbol);

        return JSON.parse(symbol);
    }

    
    async GetJsonUsersFiles(owner)
    {
        let symbol='';
        let error;
        do
        {
            error = false;

            symbol = await this.contract.methods.getJsonUsersFiles(owner).call().catch((e) =>
            {
                error = true;
                console.log(e)
            });
        }
        while (error===true || symbol===undefined)

        console.log(symbol);

        return JSON.parse(symbol);
    }

}
