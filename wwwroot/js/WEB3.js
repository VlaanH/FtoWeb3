window.userAddress = null;
window.onload = async () => {
    // Init Web3 connected to ETH network
    if (window.ethereum) 
    {
        window.web3 = new Web3(window.ethereum);
        // Load in Localstore key
        window.userAddress = window.localStorage.getItem("userAddress");
        await ShowWeb3NetAndAccount();
        
        window.ethereum.on('accountsChanged', function ()
        {
            loginWithEth(true);
        });
        window.ethereum.on('chainChanged', function()
        {
            ShowWeb3NetAndAccount();
        });
        
        if (SmartContractVersion==null)
        {
            SmartContractVersion=parseInt(LatestSmartContractVersion);
            InitContract();   
        }
       
    }

    if (typeof (initPage) === "function") 
    {
        initPage();
    }
  
 
};


async function SetNetName() 
{
    var id = await web3.eth.net.getId();
    if (id===80001)
    {
        document.getElementById("web3NetName").innerText="Polygon mumbai";
        document.getElementById("web3NetImg").src="/img/polygon-.svg";
        
    }
    else if(id===137)
    {
        document.getElementById("web3NetName").innerText="Polygon mainnet"
        document.getElementById("web3NetImg").src="/img/polygon-.svg";
    }
    else 
    {
        document.getElementById("web3NetName").innerText="Not Polygon net"
        document.getElementById("web3NetImg").src="/img/X.png";
    }
}


async function ShowWeb3NetAndAccount() 
{
    if (!window.userAddress) 
    {
        hidden("web3Net",true);
        hidden("logoutButton",true);
       
        hidden("btnLoginWithEth",false);
        
        return false;
    }
    
    // document.getElementById("userAddress").innerText = `ETH Address: ${truncateAddress(window.userAddress)}`;
    hidden("web3Net",false);
    hidden("logoutButton",false);
    
    hidden("btnLoginWithEth",true);
   
    await SetNetName(await web3.eth.net.getId());

}


async function logout() 
{
    window.userAddress = null;
    window.localStorage.removeItem("userAddress");
    
    await ShowWeb3NetAndAccount();
    RefreshAjaxPage();
}


async function loginWithEth() 
{
    if (window.web3)
    {
        try 
        {
           
            const selectedAccount = await window.ethereum
                .request
                ({
                    method: "eth_requestAccounts",
                })
                .then((accounts) => accounts[0])
                .catch(() => 
                {
                    throw Error("No account selected!");
                });
            window.userAddress = selectedAccount;
            window.localStorage.setItem("userAddress", selectedAccount);
            await ShowWeb3NetAndAccount();
            
        } 
        catch (error) 
        {
            console.error(error);
        } 
        
        RefreshAjaxPage();
       
    } 
    else 
    {
       alert("MetaMask not installed.");
    }
}




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

    var symbol;
    switch (SmartContractVersion)
    {
        default:
        case 9:
        {
            symbol = await contract.methods.AddFile(id,base64Data,partId).send({ from: window.userAddress});
            break;
        }
       
    }

    console.log(symbol);
    await FileStatusSet(FileInput);
}
async function Web3GetFile(id)
{
    var symbol;
    
    switch (SmartContractVersion)
    {
        default:
        case 9:
        {
            symbol = await contract.methods.getFile(id).call();
            break;
        }
        
    }

    console.log(symbol);

    return symbol;

}
async function Web3GetPartsLoaded(id)
{
    var symbol;
    
    switch (SmartContractVersion)
    {
        case 9:
        {
            symbol = await contract.methods.getFileSize(id).call();
            break;
        }
        default:
        {
            symbol = await contract.methods.getPartsLoaded(id).call();
        }
    }

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