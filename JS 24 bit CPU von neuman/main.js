var all = new VM();


//main.js



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