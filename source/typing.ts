module TypingModule {
	export enum actionType {
		"append", //with typing effect
		"newLine", //with typing effect
		"addDeleteLine",
		"userInput",//take the users input
		"deleteLast", // with typing effect
		"deleteAll", //with typing effect
		"clearLast", //direct delete lastchild node
		"clearAll" //delete all child node
	}
	export interface textObj {
		text2type: string;
		forwardSpeed: number;
		backwardSpeed: number;
		delay: number;
		action: actionType;
	}
	export class Typing {
		static instanceID: number = 0;
		private typingElem: HTMLElement;
		private instanceClassName: string;
		private linePrinted: number;
		private arrayIndexCounter: number;
		private effectArray: textObj[];
		private isSequenceInProgress: boolean;
		private userInputArr:string[];
		constructor(elem: HTMLElement) {
			Typing.instanceID++;
			this.instanceClassName = "typingElement typingElemID" + Typing.instanceID;
			this.typingElem = elem;
			this.linePrinted = 0;
			this.arrayIndexCounter = -1;
			this.effectArray = [];
			this.userInputArr = [];
			this.isSequenceInProgress = false;
		}

		private changeText(elem: HTMLElement, text2type: string, speed: number,increment:number,startIndex:number) {
			//elem - element to change the innerHTML
			//text2type - text to type with the typing effect
			//speed - milliseconds to call the next letter - addition/removal
			//increment - +1 or -1 for typing forward and backward respectively
			//startIndex - default : 0 , when appending - length of earlier text
			var currIndex: number = startIndex, letterTimer;
			var typingClassRef = this;//storing this to access inside the closure
			function modifyNextLetter() {
				if (currIndex>=0 && currIndex <= text2type.length) {
					elem.innerHTML = text2type.substring(0, currIndex);
					currIndex += increment;
				} else {
					clearInterval(letterTimer);					
					//need to call typeForward
					typingClassRef.manageSequence(increment);

				}
			};
			letterTimer = setInterval(modifyNextLetter, speed);
		}
		private createElem(): void {
			this.linePrinted++;
			var newNode = document.createElement("div");
			newNode.className = this.instanceClassName;
			this.typingElem.appendChild(newNode);
		}
		private removeLastChild(){
			this.linePrinted--;
			this.typingElem.removeChild(this.typingElem.lastElementChild);
		}
		private clearLast(){
			this.removeLastChild();
			this.callNextLine();
		}
		private clearAll(){
			this.linePrinted = 0;
			this.typingElem.innerHTML = "";
			this.callNextLine();
		}
		private userInput(){
			//always added in a new line
			//prepend by the input text
			var spanNode:HTMLElement = document.createElement("span");
			spanNode.innerHTML = ">> ";
			//spanNode.id="typing-current-user-input";
			this.typingElem.lastElementChild.appendChild(spanNode);			
			var spanToType:HTMLElement = <HTMLElement>this.typingElem.lastElementChild.lastElementChild;
			var userCurrentInput = ""
			var classRef = this;
			document.addEventListener("keydown", keyDownForUserInput, false);
			function keyDownForUserInput(e) {				
				var keyCode = e.which || e.keyCode;
				  if(keyCode==13) {
				  	//de-register the listener
				  		document.removeEventListener("keydown", keyDownForUserInput, false);
						classRef.userInputArr.push(userCurrentInput);
						classRef.callNextLine();
				  } else if(keyCode == 8){
				  		userCurrentInput= userCurrentInput.substring(0,userCurrentInput.length-1);
				  		spanToType.innerHTML = ">> " + userCurrentInput;
				  }else{
				  	userCurrentInput = userCurrentInput + String.fromCharCode(keyCode);
				  	spanToType.innerHTML = ">> " + userCurrentInput;
				  }
			}
		}

		private callNextLine(){
			//check if element is there
			if(this.arrayIndexCounter < this.effectArray.length-1){
				this.arrayIndexCounter++;
				this.manageSequence(0);
			}else{
				this.isSequenceInProgress = false;
			}
		}
		private manageSequence(statusFlag:number): void {
			//increment value is passed in this function - to know the current status

			var currTextObj: textObj = this.effectArray[this.arrayIndexCounter];
			
			if (currTextObj.action == actionType.newLine || this.linePrinted == 0) {
				
				//status - 0 : add element and move forward
				//status +ive : increment and call itself
				if(statusFlag == 0){
					this .createElem();
					var effectElem: HTMLElement = <HTMLElement>this.typingElem.lastElementChild;
					if(this.userInputArr.length > 0){
						currTextObj.text2type = currTextObj.text2type.replace(/#userInput#/ig, this.userInputArr[this.userInputArr.length-1]);
					}	
					var classRef = this;
					var callOnTimeOutNewLine = function(){
						classRef.changeText(effectElem, currTextObj.text2type, currTextObj.forwardSpeed, 1, 0)
					}
					setTimeout(callOnTimeOutNewLine, currTextObj.delay);
				} else {
					this.callNextLine()
				}
			} else if (currTextObj.action == actionType.append) {
				//append text, adjust starting index - move forward on status 0
				//on status +ive - increment and call itself with staus 0
				if(statusFlag == 0){
					var startIndex: number = 0;
					var effectElem: HTMLElement = <HTMLElement>this.typingElem.lastElementChild;
					var preContent: string = effectElem.innerHTML;
					startIndex = preContent.length;
					currTextObj.text2type = preContent + currTextObj.text2type;
					if(this.userInputArr.length > 0){
						currTextObj.text2type = currTextObj.text2type.replace(/#userInput#/ig, this.userInputArr[this.userInputArr.length-1]);
					}	
					var classRef = this;	
					function callOnTimeoutAppend(){
						classRef.changeText(effectElem, currTextObj.text2type, currTextObj.forwardSpeed, 1, startIndex)
					}
					setTimeout(callOnTimeoutAppend, currTextObj.delay);
				} else {
					this.callNextLine();
				}
			} else if (currTextObj.action == actionType.addDeleteLine) {
				//move forward - if satus ==0
				//move backward - if status ==+ive
				//increment array and call itself if status is -ive
				if(statusFlag ==0 ){
					this.createElem();
					var effectElem: HTMLElement = <HTMLElement>this.typingElem.lastElementChild;
					if(this.userInputArr.length > 0){
						currTextObj.text2type = currTextObj.text2type.replace(/#userInput#/ig, this.userInputArr[this.userInputArr.length-1]);
					}					
					this.changeText(effectElem, currTextObj.text2type, currTextObj.forwardSpeed, 1, 0);
				} else if (statusFlag > 0) {
					var effectElem: HTMLElement = <HTMLElement>this.typingElem.lastElementChild;
					var txt2del : string = effectElem.innerHTML;
					var classRef = this;
					function callOnTimeoutAddDelete(){
						classRef.changeText(effectElem, txt2del, currTextObj.backwardSpeed, -1, txt2del.length);
					}
					setTimeout(callOnTimeoutAddDelete, currTextObj.delay);
				} else {
					this.removeLastChild();
					this.callNextLine();
				}
			} else if (currTextObj.action == actionType.deleteLast) {
				//delete  backward - when staus 0
				//on status -ive -  callitself with status 0
				if(statusFlag == 0){
					var effectElem: HTMLElement = <HTMLElement>this.typingElem.lastElementChild;
					var txt2del:string = effectElem.innerHTML;
					var classRef = this;
					var callOnTimeoutDeleteLast = function(){
						classRef.changeText(effectElem, txt2del, currTextObj.backwardSpeed, -1, txt2del.length)
					}
					setTimeout(callOnTimeoutDeleteLast, currTextObj.delay);
				} else {
					this.callNextLine();
				}
			} else if (currTextObj.action == actionType.deleteAll) {
				//move backward - on staus 0
				//| status -ive - remove last node check if any child  
				// - true - move backward
				// - False - increment and call itself with staus 0
				if(statusFlag <=0){
					if(this.linePrinted > 1){
						if(statusFlag != 0){
							this.removeLastChild();
						}
						var effectElem: HTMLElement = <HTMLElement>this.typingElem.lastElementChild;
						var txt2del:string = effectElem.innerHTML;
						var classRef = this;
						var callOnTimeoutDelAll = function(){
							classRef.changeText(effectElem, txt2del, currTextObj.backwardSpeed, -1, txt2del.length)
						}
						setTimeout(callOnTimeoutDelAll, currTextObj.delay);
					} else {
						this.callNextLine();
					}
				}
			} else if (currTextObj.action == actionType.clearLast) {
				//delete lastnode - status 0
				//Increment Array Counter | Callitself with status 0 -when status -ive
				setTimeout(this.clearLast,5000);
			}else if (currTextObj.action == actionType.clearAll) {
				//delete all child node 
				//| increment Array counter | call itself with staus 0 when status -ive
				setTimeout(this.clearAll,currTextObj.delay);
			}else if(currTextObj.action == actionType.userInput){
				if(statusFlag == 0){
					this.createElem();
					var effectElem: HTMLElement = <HTMLElement>this.typingElem.lastElementChild;
					this.changeText(effectElem, currTextObj.text2type, currTextObj.forwardSpeed, 1, 0);
				}else{
					
					this.userInput();					 
				}
			}
		}
		startTyping(textArr: textObj[]): void {
			//check if there is something in the effectArrayList
			this.effectArray = this.effectArray.concat(textArr);
			if(!this.isSequenceInProgress){
				this.isSequenceInProgress = true;
				this.callNextLine();
			}

		}
	}
}