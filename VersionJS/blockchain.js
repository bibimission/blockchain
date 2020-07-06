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

document.getElementById("addButton").onclick = function(){
	var modalContent = document.getElementById("modalContent");
	modalContent.innerHTML = "";
	
	var addBlockModalTemplate = document.getElementById("addBlockModalTemplate");
	var addBlockModalTemplateClone = document.importNode(addBlockModalTemplate.content,true);
	
	modalContent.appendChild(addBlockModalTemplateClone);
}

let blockchain = new BlockChain();

















function BlockChain(){
	this.blocks = [];
	this.display = function(){
		var row = document.getElementById("blockchainRow");
		row.innerHTML = "";
		this.blocks.forEach(function(bloc){
			var blockCellTemplate = document.getElementById("blockCellTemplate");
			var blockCellTemplateClone = document.importNode(addBlockModalTemplate.content,true);
			
			row.appendChild(blockCellTemplateClone);
		});
	};
}

/**
*	Un bloc de la chaîne
**/
function Block(chaine){
	this.chaine = chaine;
	this.hash = chaine.hashCode();
	this.hashParent = "";
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