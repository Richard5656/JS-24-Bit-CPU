//vm.js
var entry_point = 20000;

function opm(opcode, addrorinp) { // make opcode
  //opcode maker
  //0xff 'concat' 0xffffff = 0xffffffff
  return (((opcode << 24) | ((addrorinp))) & 0xffffffff) >>> 0;
}

function register(name, datawidth) {
  this.name = name;
  this.datawidth = datawidth;
  this.value = 0;
  this.out = (bus) => {
    bus.value = this.value & this.datawidth;
  }
  this.in = (bus) => {
    this.value = bus.value & this.datawidth;
  }

  this.inc = () => {
    this.value++;
    this.value &= this.datawidth;
  }

  this.dec = () => {
    this.value--;
    this.value &= this.datawidth;
  }
}



function is_digit(character) {
  let number_tokens = "1234567890";
  return number_tokens.includes(character);
}


function bus(name, datawidth) {
  this.name = name;
  this.datawidth = datawidth;
  this.value = 0;
}

function storage(name, datawidth) {
  this.data = [];
  this.datawidth = datawidth;
  this.out = (addrbus, databus) => {
    databus.value = this.data[addrbus.value] & this.datawidth;
  }

  this.in = (addrbus, databus) => {
    this.data[addrbus.value] = databus.value & this.datawidth;
  }
}





function VM() {
  this.AX = new register("Accumulator", 0xffffffff);
  this.IX = new register("Indexer I", 0xffffffff);//pointer in memory that will be used for indexing purposes
  this.IIX = new register("Indexer II", 0xffffffff);//second pointer in memory that will be used for indexing purposes
  this.PC = new register("Program counter", 0xffffff);

  this.PC.value = entry_point;



  this.BP = new register("Base Pointer", 0xffffff);
  this.SP = new register("Stack Pointer", 0xffffff);

  this.SP.value = 0xffffff;
  this.BP.value = this.SP.value;


  this.ram = new storage("RAM", 0xffffffff);
  this.IO_Port = new storage("IO", 0xffffffff);
  this.databus = new bus("Databus", 0xffffffff);
  this.addrbus = new bus("Address bus", 0xffffffff);
  this.instrbus = new bus("Instruction Bus", 0xffffffff);
  this.flags = [0, 0, 0, 0];//flags[0] is the halt flag //flags[1] is the condition flag //flags[2] is the jmp flag //flags[3] is the interrupt flag



  this.HLT = () => {
    this.flags[0] = 1;
      this.text_disp_render();
  }


  //Accumulator direct load instrcution
  this.LDAD = () => {
    this.AX.in(this.addrbus);
  }

  this.LDAM = () => {
    this.ram.out(this.addrbus, this.databus);
    this.AX.in(this.databus);
  }
  this.STAD = () => {
    this.AX.out(this.databus);
    this.ram.in(this.addrbus, this.databus);
  }

  //stack instructions
  this.PUSH = () => {
    this.AX.out(this.databus)
    this.ram.in(this.SP, this.databus);
    this.SP.dec();
  }
  this.POP = () => {
    this.SP.inc();
    this.ram.out(this.SP, this.databus);
    this.AX.in(this.databus)
  }



  //index stack instuctions
  this.IIPUSH = () => {
    this.IIX.out(this.databus)
    this.ram.in(this.SP, this.databus);
    this.SP.dec();
  }
  this.IIPOP = () => {
    this.SP.inc();
    this.ram.out(this.SP, this.databus);
    this.IIX.in(this.databus)
  }

  this.IPUSH = () => {
    this.IX.out(this.databus)
    this.ram.in(this.SP, this.databus);
    this.SP.dec();
  }
  this.IPOP = () => {
    this.SP.inc();
    this.ram.out(this.SP, this.databus);
    this.IX.in(this.databus)
  }


  //indexer load instrutions
  this.LDID = () => {
    this.IX.in(this.addrbus);
  }

  this.LDIM = () => {
    this.ram.out(this.addrbus, this.databus);
    this.IX.in(this.databus);
  }
  this.STID = () => {
    this.IX.out(this.databus);
    this.ram.in(this.addrbus, this.databus);
  }




  this.LDIID = () => {
    this.IX.in(this.addrbus);
  }

  this.LDIIM = () => {
    this.ram.out(this.addrbus, this.databus);
    this.IIX.in(this.databus);
  }
  this.STIID = () => {
    this.IIX.out(this.databus);
    this.ram.in(this.addrbus, this.databus);
  }



  this.LDIIA = () => {
    this.IIX.out(this.addrbus);
    this.ram.out(this.addrbus, this.databus);
    this.AX.in(this.databus);
  }

  this.LDIIA = () => {
    this.IIX.out(this.addrbus);
    this.ram.out(this.addrbus, this.databus);
    this.AX.in(this.databus);
  }

  this.LDIA = () => {
    this.IX.out(this.addrbus);
    this.ram.out(this.addrbus, this.databus);
    this.AX.in(this.databus);
  }

  this.LDIA = () => {
    this.IX.out(this.addrbus);
    this.ram.out(this.addrbus, this.databus);
    this.AX.in(this.databus);
  }


  this.INCI = () => {
    this.IX.out(this.addrbus);
  }

  this.DECI = () => {
    this.IX.out(this.addrbus);
  }


  this.STIIA = () => {
    this.IIX.out(this.addrbus);
    this.AX.out(this.databus);
    this.ram.in(this.addrbus, this.databus);
  }

  this.STIA = () => {
    this.IX.out(this.addrbus);
    this.AX.out(this.databus);
    this.ram.in(this.addrbus, this.databus);
  }









  //alu instructions
  this.ADD = () => {
    this.SP.inc();
    this.ram.out(this.SP, this.databus);
    this.SP.inc();
    this.ram.out(this.SP, this.addrbus);
    this.databus.value += this.addrbus.value;
    this.ram.in(this.SP, this.databus);
    this.SP.dec();
  }

  this.SUB = () => {
    this.SP.inc();
    this.ram.out(this.SP, this.databus);
    this.SP.inc();
    this.ram.out(this.SP, this.addrbus);
    this.databus.value= this.addrbus.value-this.databus.value;
    this.ram.in(this.SP, this.databus);
    this.SP.dec();
  }

  this.DIV = () => {
    this.SP.inc();
    this.ram.out(this.SP, this.databus);
    this.SP.inc();
    this.ram.out(this.SP, this.addrbus);
     this.databus.value = this.addrbus.value/this.databus.value;
    this.ram.in(this.SP, this.databus);
    this.SP.dec();
  }
  this.MUL = () => {
    this.SP.inc();
    this.ram.out(this.SP, this.databus);
    this.SP.inc();
    this.ram.out(this.SP, this.addrbus);
    this.databus.value *= this.addrbus.value;
    this.ram.in(this.SP, this.databus);
    this.SP.dec();
  }




  this.XOR = () => {
    this.SP.inc();
    this.ram.out(this.SP, this.databus);
    this.SP.inc();
    this.ram.out(this.SP, this.addrbus);
    this.databus.value ^= this.addrbus.value;
    this.ram.in(this.SP, this.databus);
    this.SP.dec();
  }

  this.OR = () => {
    this.SP.inc();
    this.ram.out(this.SP, this.databus);
    this.SP.inc();
    this.ram.out(this.SP, this.addrbus);
    this.databus.value |= this.addrbus.value;
    this.ram.in(this.SP, this.databus);
    this.SP.dec();
  }

  this.AND = () => {
    this.SP.inc();
    this.ram.out(this.SP, this.databus);
    this.SP.inc();
    this.ram.out(this.SP, this.addrbus);
    this.databus.value &= this.addrbus.value;
    this.ram.in(this.SP, this.databus);
    this.SP.dec();
  }
  this.MOD = () => {
    this.SP.inc();
    this.ram.out(this.SP, this.databus);
    this.SP.inc();
    this.ram.out(this.SP, this.addrbus);
    this.databus.value = this.addrbus.value % this.databus.value;
    this.ram.in(this.SP, this.databus);
    this.SP.dec();
  }

  this.LS = () => {
    this.SP.inc();
    this.ram.out(this.SP, this.databus);
    this.SP.inc();
    this.ram.out(this.SP, this.addrbus);
    this.databus.value = this.addrbus.value << this.databus.value;
    this.ram.in(this.SP, this.databus);
    this.SP.dec();
  }

  this.RS = () => {
    this.SP.inc();
    this.ram.out(this.SP, this.databus);
    this.SP.inc();
    this.ram.out(this.SP, this.addrbus);
    this.databus.value = this.addrbus.value >> this.databus.value;
    this.ram.in(this.SP, this.databus);
    this.SP.dec();
  }

  this.EQ = () => {
    this.SP.inc();
    this.ram.out(this.SP, this.databus);
    this.SP.inc();
    this.ram.out(this.SP, this.addrbus);
    this.flags[1] = (this.databus.value == this.addrbus.value);
  }

  this.LT = () => {
    this.SP.inc();
    this.ram.out(this.SP, this.databus);
    this.SP.inc();
    this.ram.out(this.SP, this.addrbus);
    this.flags[1] = (this.databus.value > this.addrbus.value);

  }
  this.GT = () => {
    this.SP.inc();
    this.ram.out(this.SP, this.databus);
    this.SP.inc();
    this.ram.out(this.SP, this.addrbus);
    this.flags[1] = (this.databus.value < this.addrbus.value);
  }

  this.NE = () => {
    this.SP.inc();
    this.ram.out(this.SP, this.databus);
    this.SP.inc();
    this.ram.out(this.SP, this.addrbus);
    this.flags[1] = (this.databus.value != this.addrbus.value);
  }


  this.JMP = () => {
    this.PC.in(this.addrbus);
    this.flags[2] = 1;
  }

  this.JC = () => {
    if (this.flags[1] == 1) {
      this.PC.in(this.addrbus);
      this.flags[2] = 1;
      this.flags[1] = 0;
    }
  }
  this.JNC = () => {
    if (this.flags[1] != 1) {
      this.PC.in(this.addrbus);
      this.flags[2] = 1;
            }
  }

  this.ADJM = () => {
    this.SP.value -= this.addrbus.value;
  }

  this.ADJP = () => {
    this.SP.value += this.addrbus.value;
  }


  this.CALL = () => {

    this.BP.out(this.databus);
    this.ram.in(this.SP, this.databus);
           
    this.SP.dec();
           
           
            this.PC.inc();
    this.PC.out(this.databus);
    this.ram.in(this.SP, this.databus);
   
            this.SP.dec();
           
            this.PC.in(this.addrbus);
    this.flags[2] = 1;
   
            this.SP.out(this.addrbus);
    this.BP.in(this.addrbus);

  }

  this.RET = () => {
            this.SP.inc();
    this.ram.out(this.SP, this.addrbus);
    this.PC.in(this.addrbus);
    this.flags[2] = 1;
           
    this.SP.inc();
    this.ram.out(this.SP, this.addrbus);
    this.BP.in(this.addrbus);
  }




  this.INP = () => {
    this.AX.out(this.databus);
    this.IO_Port.in(this.addrbus, this.databus);
  }

  this.OUTP = () => {
      this.databus.value = 0;
      this.IO_Port.out(this.addrbus, this.databus);
      
    this.AX.in(this.databus);
  }

  this.BPTOII = () => {
    this.BP.out(this.addrbus);
    this.IIX.in(this.addrbus);


  }

  this.boot = (bytecode) => {
    for (i = 0; i < bytecode.length; i++) {
      this.ram.data[i + this.PC.value] = bytecode[i];
    }
  }

  this.decode_instable = [
    this.HLT,//0x00
    //LDAD,LDAM,STAD are to interact directly with the memory
    this.LDAD,//0x01
    this.LDAM,//0x02
    this.STAD,//0x03
    this.PUSH,//0x04
    this.POP, //0x05
    this.ADD, //0x06
    this.SUB, //0x07
    this.MUL, //0x08
    this.DIV, //0x09
    this.MOD, //0x0a
    this.XOR, //0x0b
    this.OR,  //0x0c
    this.AND, //0x0d
    this.LS,  //0x0e
    this.RS,  //0x0f
    this.EQ,  //0x10
    this.LT,  //0x11
    this.GT,  //0x12
    this.NE,  //0x13
    this.JMP, //0x14
    this.JC,  //0x15
    this.JNC, //0x16
    this.ADJM, //0x17
    this.CALL,//0x18
    this.RET, //0x19
    this.IIPUSH, //0x1a
    this.IIPOP,  //0x1b
    this.LDID, //0x1c
    this.LDIM, //0x1d
    this.STID, //0x1e
    this.LDIID,//0x1f
    this.LDIIM,//0x20
    this.STIID,//0x21
    this.LDIIA,//0x22
    this.LDIA, //0x23
    this.INP,  //0x24
    this.OUTP,  //0x25
    this.BPTOII, // 0x26
    this.INCI,  //0x27
    this.DECI,  //0x28
    this.STIIA,//0x29
    this.STIA, //0x2a
    this.IPUSH,//0x2b
    this.IPOP,//0x2c
            this.ADJP//0x2d
  ];


   
  this.col_of_text = 352;//64,1408 full res
  this.rows_of_text = 32;
  this.text_disp_render =  () =>{
        document.getElementById('output').textContent= "";
        for(i=0; i<this.col_of_text;i++){

            if((i%this.rows_of_text==0) && i != 0){
                document.getElementById('output').textContent+= "\n";
            }
                        document.getElementById('output').textContent+= String.fromCharCode(this.ram.data[i] & 0xff);
        }
  }





  this.begin = () => {
     

     
     
    let instruction_tokens = ["HLT", "LDAD", "LDAM", "STAD", "PUSH", "POP", "ADD", "SUB", "MUL", "DIV", "MOD", "XOR", "OR", "AND", "LS", "RS", "EQ", "LT", "GT", "NE", "JMP", "JC", "JNC", "ADJM", "CALL", "RET", "IIPUSH", "IIPOP", "LDID", "LDIM", "STID", "LDIID", "LDIIM", "STIID", "LDIIA", "LDIA", "INP", "OUTP", "BPTOII", "INCI", "DECI", "STIIA", "STIA", "IPUSH", "IPOP","ADJP"];
    while (this.flags[0] == 0) {

      this.PC.out(this.addrbus);
      this.ram.out(this.addrbus, this.instrbus);
      this.addrbus.value = (this.instrbus.value) & 0xffffff;
      this.databus.value = (this.instrbus.value >> 24) & 0xff;
     
      //this.dmp_state();
      this.decode_instable[this.databus.value]();
      //console.log(this.PC.value, instruction_tokens[this.databus.value],this.addrbus.value,this.instrbus.value,this.ram.data[0]);
          //debug pls uncomment to debug

      if (this.flags[2] != 1) {
        this.PC.inc();
      } else {
        this.flags[2] = 0;

      }
         
    }
  }


  this.log = (str) => {
    //document.getElementById("output").textContent += str + "\n";
    console.log(str);
  }

  this.dmp_state = () => {
    this.log(`${this.AX.name}: ${this.AX.value} ${this.SP.name}: ${this.SP.value} ${this.PC.name}: ${this.PC.value}  ${this.databus.name}: ${this.databus.value} ${this.addrbus.name}: ${this.addrbus.value} ${this.instrbus.name}: ${this.instrbus.value.toString(16)} ${this.IX.name}: ${this.IX.value} ${this.IIX.name}: ${this.IIX.value} Flags:  ${this.flags} Mem_loc 1000 : ${this.ram.data[1000]}`);
  }


}