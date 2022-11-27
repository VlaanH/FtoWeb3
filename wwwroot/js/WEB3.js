
function VersionSmartContractObj()
{
    this.ABI;

    this.CONTRACT_ADDRESS;
}


var SmartContractVersion;
var contract;
var CONTRACT_ADDRESS;

function InitContract()
{
    switch (SmartContractVersion)
    {
        case 9:
        {
            var versionObj = FtoWeb3V9Get();
            window.ABI = versionObj.ABI;
            CONTRACT_ADDRESS = versionObj.CONTRACT_ADDRESS;
            break;
        }
        default:
        {
            var versionObj = FtoWeb3V10Get();
            window.ABI = versionObj.ABI;
            CONTRACT_ADDRESS = versionObj.CONTRACT_ADDRESS;
            break;
        }
    }

    contract = new window.web3.eth.Contract(window.ABI, CONTRACT_ADDRESS);
}



async function Web3CrateFile(id,fileName,parts)
{
    var symbol;
    let blockSize = SizeSlider.value;
    switch (SmartContractVersion)
    {

        case 9:
        {
            symbol = await contract.methods.CreateFile(id,fileName,blockSize).send({ from: window.userAddress});
            break;
        }
        default:
        {
            symbol = await contract.methods.CreateFile(id,fileName,blockSize,parts).send({ from: window.userAddress});
            break;
        }

    }

    console.log(symbol);
    await FileStatusSet(FileInput);

}
async function Web3FileUpload(id,base64Data,partId)
{
    let error=false;
    switch (SmartContractVersion)
    {
        default:
        case 9:
        {
             new Promise(async r => 
            {
                await contract.methods.AddFile(id, base64Data, partId).send({ from: window.userAddress})
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
        }
    }
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
    while (await Web3GetFilePart(id,partId)==='')
    
    
    await FileStatusSet(FileInput);
}
async function Web3GetFile(id)
{
    let symbol='';

    switch (SmartContractVersion)
    {

        case 9:
        {
            symbol = await contract.methods.getFile(id).call();
            break;
        }
        default:
        {
            let PartsLoaded = await Web3GetPartsLoaded(id);

            let IsWholeFile = true;

            let FileArray = Array(parseInt(PartsLoaded)).fill('');

            for (let i=0;i<PartsLoaded;i++)
            {
                new Promise(async r =>
                {
                    let filePiece = await Web3GetFilePart(id, i+1);

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

            symbol = FileArray.join('')
        }
    }

    console.log(symbol);

    return symbol;

}
async function Web3GetPartsLoaded(id)
{
    let symbol;
    let error;
    do
    {
        error = false
        switch (SmartContractVersion)
        {
            
            case 9:
            {
                symbol = await contract.methods.getFileSize(id).call().catch((e) => 
                {
                    error = true;
                    console.log(e)
                });
                break;
            }
            default:
            {
                symbol = await contract.methods.getPartsLoaded(id).call().catch((e) =>
                {
                    error = true;
                    console.log(e)
                });
            }
        }
    
    } 
    while (error===true)
    
    console.log(symbol);

    return symbol;

}
async function Web3FileExist(id)
{
    var symbol;

    switch (SmartContractVersion)
    {
        default:
        case 9:
        {
            symbol = await contract.methods.FileExist(id).call();
            break;
        }

    }

    console.log(symbol);


    return symbol;

}

async function Web3GetBlockSize(id)
{
    var symbol;

    switch (SmartContractVersion)
    {
        default:
        case 9:
        {
            symbol = await contract.methods.getBlockSize(id).call();
            break;
        }
    }

    console.log(symbol);


    return symbol;
}
async function Web3GetFileName(id)
{
    var symbol;

    switch (SmartContractVersion)
    {
        default:
        case 9:
        {
            symbol = await contract.methods.getFileName(id).call();
            break;
        }

    }
    console.log(symbol);


    return symbol;
}

async function Web3GetFileSize(id,base64=null)
{
    var symbol;

    switch (SmartContractVersion)
    {

        case 9:
        {
            symbol = getBase64FileSize(base64);
            break;
        }
        default:
        {
            symbol = await contract.methods.getFileSize(id).call();
        }
    }

    let size = fileSizeNormalization(symbol);

    console.log(size);


    return size;
}

async function Web3GetFilePart(id,partId)
{
    let symbol='';
    let error;
    do 
    {
        error = false;
        
        switch (SmartContractVersion)
        {
            case 10:
            {
                symbol = await contract.methods.getFilePart(id,partId).call().catch((e) =>
                {
                    error = true;
                    console.log(e)
                });
            }
        }
        
    } 
    while (error===true || symbol===undefined)
    

    console.log(symbol);


    return symbol;
}