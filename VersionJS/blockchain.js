/**
*	Fonction de hash Sha-256
**/
function hashThis(phrase){
	var enc = new TextEncoder();
	var buffer = enc.encode(phrase);
	var hashed = crypto.subtle.digest("SHA-256",buffer);
	return hashed;
};



let blockchain = new BlockChain();
let lastHash = "";

// Le bouton d'ajout de bloc
document.getElementById("addButton").onclick = function(){
	var modalContent = document.getElementById("modalContent");
	modalContent.innerHTML = "";
	
	var addBlockModalTemplate = document.getElementById("addBlockModalTemplate");
	var addBlockModalTemplateClone = document.importNode(addBlockModalTemplate.content,true);
	
	var addButton = addBlockModalTemplateClone.getElementById("addButton");
	addButton.onclick=function(e){
		var newName = document.getElementById("exampleModalBody").querySelector("#chaineInput").value;
		if(blockchain.blocks.find(b=>b.chaine == newName)){
			e.preventDefault();
			e.stopPropagation();
			document.getElementById("exampleModalBody").querySelector("#chaineFeedback").style.display="block";
		}else{
			var newBloc = new Block(newName);
			blockchain.blocks.push(newBloc);
			blockchain.display();
		}
	};
	
	modalContent.appendChild(addBlockModalTemplateClone);
	
}

// Le bouton d'ajout de transaction
var showAddTransaction = function(){
	var modalContent = document.getElementById("modalContent");
	modalContent.innerHTML = "";
	
	var blocHash = this.getAttribute("hash");
	
	var addTransModalTemplate = document.getElementById("addTransModalTemplate");
	var addTransModalTemplateClone = document.importNode(addTransModalTemplate.content,true);
	
	var addButton = addTransModalTemplateClone.getElementById("addButton");
	addButton.onclick=function(){
		var newTransac = new Transaction();
		newTransac.id_emeteur = document.getElementById("exampleModalBody").querySelector("#emetteurInput").value;
		newTransac.id_recepteur = document.getElementById("exampleModalBody").querySelector("#recepteurInput").value;
		newTransac.montant = document.getElementById("exampleModalBody").querySelector("#montantInput").value;
		blockchain.blocks.find(b => b.hash == blocHash).transactions.push(newTransac);
	};
	
	modalContent.appendChild(addTransModalTemplateClone);
	
}

var validate = function(entity){
	entity.valideCount++;
};
var invalidate = function(entity){
	entity.nonValideCount++;
};

function BlockChain(){
	this.blocks = [];
	this.display = function(){
		var row = document.getElementById("blockchainRow");
		row.innerHTML = "";
		this.blocks.forEach(function(bloc){
			var blockCellTemplate = document.getElementById("blockCellTemplate");
			var blockCellTemplateClone = document.importNode(blockCellTemplate.content,true);
			
			blockCellTemplateClone.getElementById("blockName").innerHTML = bloc.chaine;
			blockCellTemplateClone.getElementById("detailsButton").onclick = function(){bloc.display();};
			blockCellTemplateClone.getElementById("transacButton").setAttribute("hash",bloc.hash);
			blockCellTemplateClone.getElementById("transacButton").onclick = showAddTransaction;
			
			blockCellTemplateClone.getElementById("validButt").onclick = function(){validate(bloc)};
			blockCellTemplateClone.getElementById("invalidButt").onclick = function(){invalidate(bloc)};
			
			row.appendChild(blockCellTemplateClone);
		});
	};
}

/**
*	Un bloc de la chaîne
**/
function Block(chaine){
	this.chaine = chaine;
	
	var promise = hashThis(chaine);
	promise.then((hash) => {
		this.hash = hash;
		this.hashParent = lastHash;
		lastHash = hash;
	});
	
	this.transactions = [];
	this.valideCount = 0;
	this.nonValideCount = 0;
	
	this.validate = function(){
		this.valideCount++;
	};
	this.invalidate = function(){
		this.nonValideCount++;
	};
	this.isValid = function(){
		return this.valideCount > this.nonValideCount;
	};
	
	this.display = function(){
		var modalContent = document.getElementById("modalContent");
		modalContent.innerHTML = "";
	
		var seeBlockModalTemplate = document.getElementById("seeBlockModalTemplate");
		var seeBlockModalTemplateClone = document.importNode(seeBlockModalTemplate.content,true);
		
		seeBlockModalTemplateClone.getElementById("chaine").innerHTML = this.chaine;
		seeBlockModalTemplateClone.getElementById("hash").innerHTML = arrayBufferToString(this.hash);
		seeBlockModalTemplateClone.getElementById("hashParent").innerHTML = arrayBufferToString(this.hashParent);
		seeBlockModalTemplateClone.getElementById("valide").innerHTML = this.valideCount;
		seeBlockModalTemplateClone.getElementById("invalide").innerHTML = this.nonValideCount;
		
		var transactionsDiv = seeBlockModalTemplateClone.getElementById("transactions");
		
		var transactionTemplate = document.getElementById("transactionTemplate");
		this.transactions.forEach(function(transaction){
			var transactionTemplateClone = document.importNode(transactionTemplate.content,true);
			
			transactionTemplateClone.getElementById("emetteur").innerHTML = transaction.id_emetteur;
			transactionTemplateClone.getElementById("recepteur").innerHTML = transaction.id_recepteur;
			transactionTemplateClone.getElementById("montant").innerHTML = transaction.montant;
			transactionTemplateClone.getElementById("valide").innerHTML = transaction.valideCount;
			transactionTemplateClone.getElementById("invalide").innerHTML = transaction.nonValideCount;
			
			transactionTemplateClone.getElementById("validButt").onclick = function(){validate(transaction)};
			transactionTemplateClone.getElementById("invalidButt").onclick = function(){invalidate(transaction)};
			
			transactionsDiv.appendChild(transactionTemplateClone);
		});
		
		modalContent.appendChild(seeBlockModalTemplateClone);
	};
}

/**
*	Une transaction
**/
function Transaction(){
	
	this.id_emetteur = "";
	this.id_recepteur = "";
	this.montant = 0;
	this.valideCount = 0;
	this.nonValideCount = 0;
	
	this.validate = function(){
		this.valideCount++;
	};
	this.invalidate = function(){
		this.nonValideCount++;
	};
	this.isValid = function(){
		return this.valideCount > this.nonValideCount;
	};
}

function arrayBufferToString(ab){
	if(ab !=""){
		var enc = new TextDecoder("utf-8");
		return enc.decode(ab);
	}
	return "";
};