function getETHBalance(address,goalID,donateValue,maxValue)
{

    if (typeof web3 !== 'undefined') 
    {
        web3 = new Web3(web3.currentProvider);
    } 
    else 
    {
        var web3 = new Web3('https://rinkeby.infura.io/v3/755e3f58cf2e49128530c4058b2bdb04');
    }
    
     web3.eth.getBalance(address, function(err, result)
     {
        if (err) 
        {
            console.log(err)
        } 
        else
        {
            var balance = web3.utils.fromWei(result, "ether");
            if (balance.length>11)
            {
                balance= balance.substring(0,11);
                
                //0.000000 to 0
                if (balance==0)
                {
                    balance=0; 
                }
                
            }
            
           
            
            document.getElementById(`value_progress_${goalID}`).innerHTML=balance+"ETH";

            var procent = `${GetPercentDonate(balance,donateValue)}`;
            var procentMaxValue = `${GetPercentDonate(maxValue,donateValue)}`;
            
            document.getElementById(`progress_percent_${goalID}`).innerHTML=(procent+"%");

        }
         
         
        document.getElementById(`progress-bar-Max-Value_${goalID}`).style.width=(procentMaxValue-procent)+"%";
        document.getElementById(`progress-bar_${goalID}`).style.width=procent+"%";
    })

 
  
}

function GetPercentDonate(balance,donateValue)
{
    if (donateValue!=0)
    {
        return ((balance / donateValue * 100 ).toString()).substring(0,5);
    }
    else 
    {
        return 0;
    }
    
}
function dependencyOnCheckbox(chbox,itemId)
{
    
    if (chbox.checked)
    {
        document.getElementById(itemId).hidden=false;
    }
    else
    {
        document.getElementById(itemId).hidden=true;
       
    }
    
}
function CheckboxOff(chbox) 
{
   
   
    document.getElementById(chbox).checked=false;
    
}

function dependencyOnCheckboxHiddenOnly(chbox,itemId)
{

    if (chbox.checked!=true)
    {
        document.getElementById(itemId).hidden=true;
    }
   

}

function SetBackground(image)
{
    if (image==="default")
        document.body.style.backgroundImage=null;
    else 
    document.body.style.backgroundImage=`url('${image}')`;
}