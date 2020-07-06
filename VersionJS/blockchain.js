/**
*	Implemente la méthode de Hash à l'objet String
**/
Object.defineProperty(String.prototype, 'hashCode', {
  value: function() {
    var hash = 0, i, chr;
    for (i = 0; i < this.length; i++) {
      chr   = this.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0;
    }
    return hash;
  }
});

let blockchain = new BlockChain();
let lastHash = "";

// Le bouton d'ajout de bloc
document.getElementById("addButton").onclick = function(){
	var modalContent = document.getElementById("modalContent");
	modalContent.innerHTML = "";
	
	var addBlockModalTemplate = document.getElementById("addBlockModalTemplate");
	var addBlockModalTemplateClone = document.importNode(addBlockModalTemplate.content,true);
	
	var addButton = addBlockModalTemplateClone.getElementById("addButton");
	addButton.onclick=function(){
		var newBloc = new Block(document.getElementById("exampleModalBody").querySelector("#chaineInput").value);
		blockchain.blocks.push(newBloc);
		blockchain.display();
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
			
			row.appendChild(blockCellTemplateClone);
		});
	};
}

/**
*	Un bloc de la chaîne
**/
function Block(chaine){
	this.chaine = chaine;
	
	var newHash = chaine.hashCode();
	this.hash = newHash;
	this.hashParent = lastHash;
	lastHash = newHash;
	
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
		seeBlockModalTemplateClone.getElementById("hash").innerHTML = this.hash;
		seeBlockModalTemplateClone.getElementById("hashParent").innerHTML = this.hashParent;
		seeBlockModalTemplateClone.getElementById("valide").innerHTML = this.valideCount;
		seeBlockModalTemplateClone.getElementById("invalide").innerHTML = this.nonValideCount;
		
		var transactionsDiv = seeBlockModalTemplateClone.getElementById("transactions");
		this.transactions.forEach(function(transaction){
			var transDiv = document.createElement("div");
			transDiv.innerHTML = transaction;
			transactionsDiv.appendChild(transDiv);
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
	this.toString = function(){
		return this.id_emeteur + " à " + this.id_recepteur + " montant: " + this.montant;
	};
}