class FtoWeb3V9 
{
    constructor()
    {
        this.version = 9;
        this.CONTRACT_ADDRESS = '0xF46068Fcd98BD1dD8e8008d83BBbe97F9e33fc92';
        this.ABI = [{"inputs":[],"stateMutability":"payable","type":"constructor"},{"inputs":[{"internalType":"string","name":"id","type":"string"},{"internalType":"string","name":"base64Data","type":"string"},{"internalType":"uint256","name":"partId","type":"uint256"}],"name":"AddFile","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"string","name":"id","type":"string"},{"internalType":"string","name":"fileName","type":"string"},{"internalType":"uint256","name":"BlockSize","type":"uint256"}],"name":"CreateFile","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"string","name":"id","type":"string"}],"name":"FileExist","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"id","type":"string"}],"name":"getBlockSize","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"id","type":"string"}],"name":"getFile","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"id","type":"string"}],"name":"getFileName","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"id","type":"string"}],"name":"getFileSize","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address payable","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"versions","outputs":[{"internalType":"int256","name":"","type":"int256"}],"stateMutability":"view","type":"function"}];

        this.contract = new window.web3.eth.Contract(this.ABI, this.CONTRACT_ADDRESS);
        
    }
    async CrateFile(id,fileName,blockSize)
    {
        return await this.contract.methods.CreateFile(id,fileName,blockSize).send({ from: window.userAddress});
    }
    
    async FileUpload(id,base64Data,partId)
    {
        await this.contract.methods.AddFile(id, base64Data, partId).send({ from: window.userAddress});
        
    }
    
    async GetFile(id)
    {
         return await this.contract.methods.getFile(id).call();
    }

    GetFileSize(base64)
    {
        return getBase64FileSize(base64);
    }
    
    async GetPartsLoaded(id)
    {
        let symbol;
        let error = false;

        symbol = await this.contract.methods.getFileSize(id).call().catch((e) =>
        {
            error = true;
            console.log(e)
        });

        while (error===true)
        
        console.log(symbol);

        return symbol;
    }
    
    async FileExist(id)
    {
        return await this.contract.methods.FileExist(id).call();
    }
    
    async GetBlockSize(id)
    {
        return await this.contract.methods.getBlockSize(id).call();
    }
    
    async GetFileName(id)
    {
        return await this.contract.methods.getFileName(id).call();
    }
}