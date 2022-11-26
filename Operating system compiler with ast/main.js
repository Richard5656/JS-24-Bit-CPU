var all = new VM();


//main.js

function inject_keyboard(){
	let chars = document.getElementById("keyboard").value.split('');
	all.IO_Port.data[15] = 0;
	for(ieee=0; ieee< chars.length; ieee++){
		all.IO_Port.data[0] = chars[ieee].charCodeAt();

		all.flags[0] = 0;
		all.begin();
	}
}

document.addEventListener('keydown', function(event) {
		    
			all.IO_Port.data[0] = String.fromCharCode(event.keyCode).toLowerCase().charCodeAt();
			all.IO_Port.data[15] = 0;
			if(all.IO_Port.data[0] >= 97 && all.IO_Port.data[0] <= 122){
				all.flags[0] = 0;
				all.begin();
			}
			if(event.keyCode == 13){
				all.IO_Port.data[15] =1;
				all.flags[0] = 0;
				all.begin();
			}
		
});


//nintendo switch joycon support
/*
setInterval(function() {
	let ep = navigator.getGamepads()[0];
    if(ep.buttons[0].pressed == true){
		all.IO_Port.data[0] ='a'.charCodeAt();
		all.flags[0] = 0;
		all.begin();		

	}else  if(ep.buttons[1].pressed == true){
		all.IO_Port.data[0] ='s'.charCodeAt();
		all.flags[0] = 0;
		all.begin();		
	}else  if(ep.buttons[2].pressed == true){
		all.IO_Port.data[0] ='w'.charCodeAt();
		all.flags[0] = 0;
		all.begin();		
	}else if(ep.buttons[3].pressed == true){
		all.IO_Port.data[0] ='d'.charCodeAt();
		all.flags[0] = 0;
		all.begin();		
	}
	
},100);
*/


function inject_ports(){
	
	
	for(i=0; i< document.getElementsByClassName("IO").length;i++){
		if(document.getElementsByClassName("IO")[i].value != ""){
			all.IO_Port.data[i] = parseInt(document.getElementsByClassName("IO")[i].value);
		}else{
			
			all.IO_Port.data[i] = 0;

		}
	}
	all.flags[0] = 0;
	all.begin();
	

}

function log_ports(){
	for(i=0; i< document.getElementsByClassName("IO").length;i++){
		console.log(all.IO_Port.data[i]);
	}
}


function asmrun() {
  all = new VM();
  for(i=0; i<all.col_of_text;i++){
            all.ram.data[i] = 65;
  }
  document.getElementById("output").textContent = "";
  all.boot(assembler(document.getElementById("codearea").value));
  //console.log(all.ram.data);
  all.begin();
  all.dmp_state();

}


function compile_to_assembly() {
  document.getElementById("codearea").value = compile(document.getElementById("code_area_C").value);
}



//for(i=0;i<all.ram.data.length;i++){console.log(i,all.rom.data[i].toString(16));}
//document.getElementById("o").innerHTML = i;
