//assembler.js
function assembler(code){



      let instruction_tokens = ["HLT", "LDAD", "LDAM", "STAD", "PUSH", "POP", "ADD", "SUB", "MUL", "DIV", "MOD", "XOR", "OR", "AND", "LS", "RS", "EQ", "LT", "GT", "NE", "JMP", "JC", "JNC", "ADJM", "CALL", "RET", "IIPUSH", "IIPOP", "LDID", "LDIM", "STID", "LDIID", "LDIIM", "STIID", "LDIIA", "LDIA", "INP", "OUTP", "BPTOII","INCI","DECI","STIIA","STIA","IPUSH","IPOP","ADJP"];
      let misc_tokens = ["LABEL"];
      let internal_pc = entry_point;
      let byte_code = [];
      let tokens = [];
      let keep_track ="";
     
     
      for(i =0; i<code.length; i++){
          if(code[i] != '\n' && code[i] != ' ' ){keep_track+= code[i];}
           
           
                         if(instruction_tokens.includes(keep_track)){
                                                tokens.push([0,instruction_tokens.indexOf(keep_track),keep_track]);
                                                internal_pc++;
                                                //console.log(internal_pc,keep_track);
                                                keep_track ="";
                                                }else if(misc_tokens.includes(keep_track)){
                                                              tokens.push([1,internal_pc,keep_track]);
                                                              keep_track ="";
                                                }else if(is_digit(code[i]) && is_digit(keep_track[0])){
                                                              i++;
                                                              while(is_digit(code[i])){
                                                                                    keep_track+=code[i];
                                                                                    i++;
                                                              }
                                                              tokens.push([2,parseInt(keep_track),keep_track]);
                                                             
                                                            keep_track ="";
                                    }else if(code[i] == '\n' || code[i] == ' ' ){
                                                if(keep_track !=""){
                                                tokens.push([3,0,keep_track]);
                                                keep_track ="";
                        }
      }
  }
         
    //label doing

    for (i=0; i<tokens.length; i++){
                       
        if(tokens[i][0] == 1){
            let ident = tokens[i+1][2];
            let memloc = tokens[i][1];
                                   
            for (k=0;k<tokens.length;k++){
                                               
                if(ident == tokens[k][2]){
                    tokens[k][1] = memloc;
                }
            }
            tokens.splice(i,2);
                                    i--;

        }
    }
       
   
  for(i=0; i<tokens.length; i++){
      if(i+1 != tokens.length){
          if(tokens[i+1][0] != 0){
            byte_code.push(opm(tokens[i][1]&0xff,tokens[i+1][1]&0xfffff));
            i++;
          }else{
             byte_code.push(opm(tokens[i][1]&0xff,0x00000));
          }
      }
  }

            //console.log(tokens);
    return byte_code;
}