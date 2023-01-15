class FtoWeb3V10 extends FtoWeb3V9 
{
    constructor()
    {
        super();
        this.version = 10;
        this.CONTRACT_ADDRESS = '0x33976ae943e08860432504018f460b0154ee671d';
        this.ABI = [{"inputs":[],"stateMutability":"payable","type":"constructor"},{"inputs":[{"internalType":"string","name":"id","type":"string"},{"internalType":"string","name":"base64Data","type":"string"},{"internalType":"uint256","name":"partId","type":"uint256"}],"name":"AddFile","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"string","name":"id","type":"string"},{"internalType":"string","name":"fileName","type":"string"},{"internalType":"uint256","name":"blockSize","type":"uint256"},{"internalType":"uint256","name":"parts","type":"uint256"}],"name":"CreateFile","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"string","name":"id","type":"string"}],"name":"FileExist","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"id","type":"string"}],"name":"getBlockSize","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"id","type":"string"}],"name":"getFile","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"id","type":"string"}],"name":"getFileName","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"id","type":"string"},{"internalType":"uint256","name":"part","type":"uint256"}],"name":"getFilePart","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"id","type":"string"}],"name":"getFileSize","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"id","type":"string"}],"name":"getPartsLoaded","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address payable","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"versions","outputs":[{"internalType":"int256","name":"","type":"int256"}],"stateMutability":"view","type":"function"}]

        this.contract = new window.web3.eth.Contract(this.ABI, this.CONTRACT_ADDRESS);
    }

    async CrateFile(id,fileName,blockSize,parts)
    {
        return await this.contract.methods.CreateFile(id,fileName,blockSize,parts).send({ from: window.userAddress});
    }
    
    async FileUpload(id,base64Data,partId)
    {
        let error = false;

        new Promise(async r =>
        {
            await this.contract.methods.AddFile(id, base64Data, partId).send({ from: window.userAddress})
                .catch((e) => {
                    //The absence of a code and original Error means that the limit of 50 blocks has been exceeded while waiting for a transaction
                    console.log(e)
                    if (e.code !== undefined || e.originalError == null)
                    {
                        if(e.toString().includes('not mined within 50 blocks')===false)
                            error = true;
                    }
                });
        });

        do
        {
            if (error)
            {
                throw null;
            }
            else
            {
                await new Promise(r => setTimeout(r, 10000));
            }
        }
        while (await this.GetFilePart(id,partId)==='')

    }

    async GetFilePart(id,partId)
    {
        let symbol='';
        let error;
        do
        {
            error = false;
                
            symbol = await this.contract.methods.getFilePart(id,partId).call().catch((e) =>
            {
                error = true;
                console.log(e)
            });
            
        }
        while (error===true || symbol===undefined)
        
        console.log(symbol);
        
        return symbol;
    }

    async GetFile(id)
    {
        let PartsLoaded = await this.GetPartsLoaded(id);

        let IsWholeFile = true;

        let FileArray = Array(parseInt(PartsLoaded)).fill('');

        for (let i=0; i<PartsLoaded; i++)
        {
            new Promise(async r =>
            {
                let filePiece = await this.GetFilePart(id, i+1);

                if (filePiece==='')
                {
                    IsWholeFile = false;

                    throw IsWholeFile;
                }

                FileArray[i] = filePiece;
            });
            console.log(PartsLoaded-i);
        }

        while (IsAllArrayFull(FileArray,'')===false)
        {
            await new Promise(r => setTimeout(r, 100));
        }

        return FileArray.join('')
    }

    async GetFileSize(base64,id)
    {
        return await this.contract.methods.getFileSize(id).call();
    }
    
    async GetPartsLoaded(id)
    {
        let symbol;
        let error;
        do
        {
            symbol = await this.contract.methods.getPartsLoaded(id).call().catch((e) =>
            {
                error = true;
                console.log(e)
            });
        }
        while (error===true)
        
        return symbol;
    }
}