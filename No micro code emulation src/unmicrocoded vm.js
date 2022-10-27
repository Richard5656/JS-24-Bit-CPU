//unmicrocoded vm
//vm.js
var entry_point = 5000;

function opm(opcode, addrorinp) { // make opcode
  //opcode maker
  //0xff 'concat' 0xffffff = 0xffffffff
  return (((opcode << 24) | ((addrorinp))) & 0xffffffff) >>> 0;
}




function is_digit(character) {
  let number_tokens = "1234567890";
  return number_tokens.includes(character);
}






function VM() {
  
  this.AX = 0;////0xffffff max
  this.IX = 0;//0xffffff max
  this.IIX = 0;//0xffffff max
  this.PC = entry_point;//0xffffff max



  this.bp = 0;//0xffffff max
  this.sp = 0xfff000;//0xffffff max

  this.bp = this.sp;//0xffffff max


  this.ram = [];//0xffffffff max bit width 
  this.IO_Port = []; //0xff max bit width

  this.flags = [0, 0, 0, 0];//flags[0] is the halt flag //flags[1] is the condition flag //flags[2] is the jmp flag //flags[3] is the interrupt flag

    
  this.col_of_text = 352;//64,1408 full res
  this.rows_of_text = 32;

    
    
    
    
    
  this.text_disp_render =  () =>{
        document.getElementById('output').textContent= "";
        for(i=0; i<this.col_of_text;i++){

            if((i%this.rows_of_text==0) && i != 0){
                document.getElementById('output').textContent+= "\n";
            }
                        document.getElementById('output').textContent+= String.fromCharCode(this.ram[i] & 0xff);
        }
  }
  
  

for(i=0; i<this.col_of_text;i++){
        this.ram[i] = 65;
}
this.text_disp_render();

    
    
    
  this.boot = (bytecode) => {
    for (i = 0; i < bytecode.length; i++) {
      this.ram[i + this.PC] = bytecode[i];
    }
  }
    
      let instruction_tokens = ["HLT", "LDAD", "LDAM", "STAD", "PUSH", "POP", "ADD", "SUB", "MUL", "DIV", "MOD", "XOR", "OR", "AND", "LS", "RS", "EQ", "LT", "GT", "NE", "JMP", "JC", "JNC", "ADJM", "CALL", "RET", "IIPUSH", "IIPOP", "LDID", "LDIM", "STID", "LDIID", "LDIIM", "STIID", "LDIIA", "LDIA", "INP", "OUTP", "BPTOII","INCI","DECI","STIIA","STIA","IPUSH","IPOP","ADJP"];

    
    
    
let fde = (clk)=>{
        let opcode = (this.ram[this.PC] >> 24) & 0xff;
        let location_or_const = (this.ram[this.PC]) & 0xffffff;
        /*
        //debug
        if(this.PC == 5029-1){
            console.log(this.PC,instruction_tokens[opcode],location_or_const,this.AX,this.IIX);
            console.log(this.ram[this.IIX]);
        }
*/
        
        
        switch(opcode){
            case 0x00: //HLT
                this.flags[0] = 1;
            break;
                
                
            case 0x01: // LDAD
                this.AX = location_or_const;
            break;
            
                
            case 0x02: //LDAM
                this.AX = this.ram[location_or_const];
            break;
                
            case 0x03: //STAD
                this.ram[location_or_const] = this.AX;
            break;
                
            case 0x04: // PUSH
                this.ram[this.sp++] = this.AX;

            break;
            
            case 0x05: // POP
                this.AX = this.ram[--this.sp];
            break;
            
                
            case 0x06://ADD
                this.ram[this.sp-2]+= this.ram[this.sp-1];
                this.sp--;
            break;
                
            case 0x07://SUB
                this.ram[this.sp-2]-= this.ram[this.sp-1];
                this.sp--;
            break;
                
            case 0x08://MUL
                this.ram[this.sp-2]*= this.ram[this.sp-1];
                this.sp--;
            break;
                
            case 0x09://DIV
                this.ram[this.sp-2] /= this.ram[this.sp-1];
                this.sp--;
            break;
                
                
            case 0x0a://MOD
                this.ram[this.sp-2]%= this.ram[this.sp-1];
                this.sp--;
            break;
                
            case 0x0b://XOR
                this.ram[this.sp-2]^= this.ram[this.sp-1];
                this.sp--;
            break;
            
            case 0x0C://OR
                this.ram[this.sp-2]|= this.ram[this.sp-1];
                this.sp--;
            break;
            case 0x0D://AND
                this.ram[this.sp-2]&= this.ram[this.sp-1];
                this.sp--;
            break;

                
            case 0x0E://LS
                this.ram[this.sp-2]<<= this.ram[this.sp-1];
                this.sp--;
            break;
                
                
            case 0x0F://RS
                this.ram[this.sp-2]^= this.ram[this.sp-1];
                this.sp--;
            break;
                
            case 0x10://EQ
                this.flags[1] = this.ram[this.sp-2]== this.ram[this.sp-1];
                this.sp-=2;
            break;
                
            case 0x11://LT
                this.flags[1] = this.ram[this.sp-2]<this.ram[this.sp-1];
                this.sp-=2;
            break;

                
            case 0x12://GT
                this.flags[1] = this.ram[this.sp-2]>this.ram[this.sp-1];
                this.sp-=2;
            break;
                
            case 0x13://NE
                this.flags[1] = this.ram[this.sp-2]!= this.ram[this.sp-1];
                this.sp-=2;
            break;
           
                
                
           case 0x14://JMP
                this.PC = location_or_const;
                this.flags[2]=1;
           break;
                
           case 0x15://JC
                if(this.flags[1] == 1){
                    this.PC = location_or_const;
                    this.flags[1]=0;
                    this.flags[2]=1;

                }
           break; 
                
                
           case 0x16://JNC
                if(this.flags[1] != 1){
                    this.PC = location_or_const;
                    this.flags[2]=1;

                }
           break;
                
           case 0x17://ADJM
                this.sp -= location_or_const;
           break;

           case 0x18: //CALL
                this.ram[this.sp++] = this.bp;
                this.ram[this.sp++] = this.pc;
                this.PC = location_or_const;
           break;
                
           case 0x19: //RET
                this.ram[--this.sp] = this.bp;
                this.ram[--this.sp] = this.pc;
                this.PC = location_or_const;
           break;
           
                
            case 0x1a: //IIPUSH
                this.ram[this.sp++] = this.IIX;
            break;
                
            case 0x1b: //IIPOP
                this.IIX = this.ram[--this.sp];
            break;
                
            case 0x1c: // LDID
                this.IX = location_or_const;
            break;
            
                
            case 0x1d: //LDIM
                this.IX = this.ram[location_or_const];
            break;
                
            case 0x1e: //STID
                this.ram[location_or_const] = this.IX;
            break;

                
            case 0x1f: // LDIID
                this.IIX = location_or_const;
            break;
            
                
            case 0x20: //LDIIM
                this.IIX = this.ram[location_or_const];
            break;
                
            case 0x21: //STIID
                this.ram[location_or_const] = this.IIX;
            break;
                
            case 0x22: // LDIIA
                this.AX = this.ram[this.IIX];
            break;   
                
                
            case 0x23: //LDIA
                this.AX = this.ram[this.IX];
            break;
                
            case 0x25://inp
                this.IO[location_or_const] = this.AX;
            break;
                
            case 0x26://outp
                this.AX = this.IO[location_or_const];
            break;
            
            case 0x27: //INCI
                this.IX++;
            break;
                
            case 0x28: // DECI
                this.IX++;
            break;
            
            
            case 0x29: //STIIA
                this.ram[this.IIX] = this.AX;
            break;
         
                
            case 0x2a: //STIA
                this.ram[this.IX] = this.AX;
            break;
                
                
            case 0x2b: //IPUSH
                this.ram[this.sp++] = this.IX;
            break;
                
            case 0x2c: //IPOP
                this.IX = this.ram[--this.sp];
            break;
                
           case 0x2d://ADJP
                this.sp += location_or_const;
           break;

           
           
           default:
                this.flags[0] = 1;
           break;
        }
        if(this.flags[2]!=1){
            this.PC++;
        }else{
            this.flags[2]=0;
        }
        this.text_disp_render();
    if(this.flags[0] == 1){
      clearInterval(clk);
    }
}
    

this.beginCLK = () =>{
    clearInterval(clk);
    var clk = setInterval(function(){fde(clk);});
}



this.begin = ()=>{
    while(this.flags[0] != 1){
        let opcode = (this.ram[this.PC] >> 24) & 0xff;
        let location_or_const = (this.ram[this.PC]) & 0xffffff;
        /*
        //debug
        if(this.PC == 5029-1){
            console.log(this.PC,instruction_tokens[opcode],location_or_const,this.AX,this.IIX);
            console.log(this.ram[this.IIX]);
        }
*/
        
        
        switch(opcode){
            case 0x00: //HLT
                this.flags[0] = 1;
            break;
                
                
            case 0x01: // LDAD
                this.AX = location_or_const;
            break;
            
                
            case 0x02: //LDAM
                this.AX = this.ram[location_or_const];
            break;
                
            case 0x03: //STAD
                this.ram[location_or_const] = this.AX;
            break;
                
            case 0x04: // PUSH
                this.ram[this.sp++] = this.AX;

            break;
            
            case 0x05: // POP
                this.AX = this.ram[--this.sp];
            break;
            
                
            case 0x06://ADD
                this.ram[this.sp-2]+= this.ram[this.sp-1];
                this.sp--;
            break;
                
            case 0x07://SUB
                this.ram[this.sp-2]-= this.ram[this.sp-1];
                this.sp--;
            break;
                
            case 0x08://MUL
                this.ram[this.sp-2]*= this.ram[this.sp-1];
                this.sp--;
            break;
                
            case 0x09://DIV
                this.ram[this.sp-2] /= this.ram[this.sp-1];
                this.sp--;
            break;
                
                
            case 0x0a://MOD
                this.ram[this.sp-2]%= this.ram[this.sp-1];
                this.sp--;
            break;
                
            case 0x0b://XOR
                this.ram[this.sp-2]^= this.ram[this.sp-1];
                this.sp--;
            break;
            
            case 0x0C://OR
                this.ram[this.sp-2]|= this.ram[this.sp-1];
                this.sp--;
            break;
            case 0x0D://AND
                this.ram[this.sp-2]&= this.ram[this.sp-1];
                this.sp--;
            break;

                
            case 0x0E://LS
                this.ram[this.sp-2]<<= this.ram[this.sp-1];
                this.sp--;
            break;
                
                
            case 0x0F://RS
                this.ram[this.sp-2]^= this.ram[this.sp-1];
                this.sp--;
            break;
                
            case 0x10://EQ
                this.flags[1] = this.ram[this.sp-2]== this.ram[this.sp-1];
                this.sp-=2;
            break;
                
            case 0x11://LT
                this.flags[1] = this.ram[this.sp-2]<this.ram[this.sp-1];
                this.sp-=2;
            break;

                
            case 0x12://GT
                this.flags[1] = this.ram[this.sp-2]>this.ram[this.sp-1];
                this.sp-=2;
            break;
                
            case 0x13://NE
                this.flags[1] = this.ram[this.sp-2]!= this.ram[this.sp-1];
                this.sp-=2;
            break;
           
                
                
           case 0x14://JMP
                this.PC = location_or_const;
                this.flags[2]=1;
           break;
                
           case 0x15://JC
                if(this.flags[1] == 1){
                    this.PC = location_or_const;
                    this.flags[1]=0;
                    this.flags[2]=1;

                }
           break; 
                
                
           case 0x16://JNC
                if(this.flags[1] != 1){
                    this.PC = location_or_const;
                    this.flags[2]=1;

                }
           break;
                
           case 0x17://ADJM
                this.sp -= location_or_const;
           break;

           case 0x18: //CALL
                this.ram[this.sp++] = this.bp;
                this.ram[this.sp++] = this.pc;
                this.PC = location_or_const;
           break;
                
           case 0x19: //RET
                this.ram[--this.sp] = this.bp;
                this.ram[--this.sp] = this.pc;
                this.PC = location_or_const;
           break;
           
                
            case 0x1a: //IIPUSH
                this.ram[this.sp++] = this.IIX;
            break;
                
            case 0x1b: //IIPOP
                this.IIX = this.ram[--this.sp];
            break;
                
            case 0x1c: // LDID
                this.IX = location_or_const;
            break;
            
                
            case 0x1d: //LDIM
                this.IX = this.ram[location_or_const];
            break;
                
            case 0x1e: //STID
                this.ram[location_or_const] = this.IX;
            break;

                
            case 0x1f: // LDIID
                this.IIX = location_or_const;
            break;
            
                
            case 0x20: //LDIIM
                this.IIX = this.ram[location_or_const];
            break;
                
            case 0x21: //STIID
                this.ram[location_or_const] = this.IIX;
            break;
                
            case 0x22: // LDIIA
                this.AX = this.ram[this.IIX];
            break;   
                
                
            case 0x23: //LDIA
                this.AX = this.ram[this.IX];
            break;
                
            case 0x25://inp
                this.IO[location_or_const] = this.AX;
            break;
                
            case 0x26://outp
                this.AX = this.IO[location_or_const];
            break;
            
            case 0x27: //INCI
                this.IX++;
            break;
                
            case 0x28: // DECI
                this.IX++;
            break;
            
            
            case 0x29: //STIIA
                this.ram[this.IIX] = this.AX;
            break;
         
                
            case 0x2a: //STIA
                this.ram[this.IX] = this.AX;
            break;
                
                
            case 0x2b: //IPUSH
                this.ram[this.sp++] = this.IX;
            break;
                
            case 0x2c: //IPOP
                this.IX = this.ram[--this.sp];
            break;
                
           case 0x2d://ADJP
                this.sp += location_or_const;
           break;

           
           
           default:
                this.flags[0] = 1;
           break;
        }
        if(this.flags[2]!=1){
            this.PC++;
        }else{
            this.flags[2]=0;
        }
        this.text_disp_render();
        }
    this.text_disp_render();
    
    }
}

/*
int main(){
*(900) = 0;

while(*(900) < 100){
*(*(900)) = *(900);
*(900) = *(900) + 1;

}
return 0;
}

*/



/*
var fg = new VM();

fg.ram.push(opm(0x01,0x000005));

fg.begin();
console.log(fg.AX);
*/