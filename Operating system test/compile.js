//compile.js
function compile(code) {
  this.current_scope = "main";
  this.bp_scope_count = {}; // this.bp_scope_count['scope_name'] = int;
  this.var_table = {}; // this.var_table['scope_name']['varible_name'] = {"varible_type":int|char|array,"varible_name": "varible_name","varible_bp_offset":int};
  this.func_proc_table = {};
 
  this.lexer = (code) => {
    let tokens = [];
    /*
     tokens values
     [[col,row],idenntification_value,actual token]
      identification_value
            0: identifier
            1: integer
            2: key_word
            3: symbol
            4: string
    */
    let multi_sym = ["-", "*", "+", "=", "<", "!", ">","%","^","|","&","$"];
    let symbols = ["[", "]", ",", "(", ")", "{", "}", ";"];
    let keywords = ["while", "if", "for", "main", "int", "return","asm","arg","char","global","bpa"];
    let keep_track = "";
    let col = 0;
    let row = 0;


    for (i = 0; i < code.length; i++) {
      col += 1
      if (keep_track == "//") {
        keep_track = "";
        while (code[i] != "\n") {
          i++;
        }
      }
	  
	  

      if (code[i] == '\n') {
        col = 0;
        row += 1;
      }

      
      

      if (symbols.includes(code[i]) || multi_sym.includes(code[i])) {
        if (keep_track != "") {
          tokens.push([
            [col, row], 0, keep_track
          ]);
          keep_track = "";
        }
      }



      if (code[i] == '\n' || code[i] == ' ' || code[i] == '\t') {

        if (keep_track != "") {
          tokens.push([[col, row], 0, keep_track]);
          keep_track = "";
        }

      } else {
        keep_track += code[i];
      }


      if (multi_sym.includes(keep_track)) {
        if (code[i + 1] == "=") {
          keep_track += code[++i];
          tokens.push([[col, row], 3, keep_track]);
          keep_track = "";
        }else if (code[i + 1] == ">") {
          keep_track += code[++i];
          tokens.push([[col, row], 3, keep_track]);
          keep_track = "";
        }else if (code[i + 1] == "<") {
          keep_track += code[++i];
          tokens.push([[col, row], 3, keep_track]);
          keep_track = "";
        } else {
          tokens.push([[col, row], 3, keep_track]);
          keep_track = "";
        }
      }




      if (is_digit(code[i])) {
        i++;
        while (is_digit(code[i])) {
          keep_track += code[i];
          i++;
        }
        i--;
        tokens.push([[col, row], 1, keep_track]);
        keep_track = "";
      }


      if (symbols.includes(keep_track)) {
        tokens.push([[col, row], 3, keep_track]);
        keep_track = "";
      }


      if (keywords.includes(keep_track)) {
        tokens.push([[col, row], 2, keep_track]);
      
        if(keep_track=="asm"){
            keep_track = "";
            i++;
            i++;
            while(code[i] != '}'){
                keep_track += code[i];
                i++;
            }
            tokens.push([[col, row], 2, keep_track]);
            i++;
        }
          keep_track = "";
        
      }
       
       
        if(keep_track == "\""){ // string handliation
            keep_track = "";
            i++;
            while(code[i] != "\""){
                keep_track+= code[i];
                row++;
                i++;
            }
           tokens.push([[col, row], 4, keep_track]);
           keep_track = "";
        }
       
    }     
    return tokens;
  }


//#########################################################################################PARSER SECTION
  this.parse_gen = (tokens) => {
    this.index = 0;
    this.label_count = 0;
    this.log = (msg) => {
      let msg_buf = "COl:" + tokens[this.index][0][0] + " " + "ROW:" + tokens[this.index][0][1] + " " + msg;
      console.log(msg_buf);
    }

    this.ASM = "";

    this.expt = (code) => {
      this.ASM += code + '\n';
    }

    this.match = (str) => {
      if (str == tokens[this.index][2]) {
        this.index++;
      } else {
        this.log("Expected \"" + str + "\" got \"" + tokens[this.index][2] + "\"");
        throw new Error("Error");
      }
    }





    this.type_match = (integer) => {
      if (tokens[this.index][1] != integer) {
        this.log("Type error");
        throw new Error("Type error");
      }
    }

    this.pointer_pacg = () => {
      this.match("*");
      if(tokens[this.index][2] == "("){
		this.match("(");
	  }
      this.expr_pacg();
      if(tokens[this.index][2] == ")"){
			this.match(")");
	  }

      if (tokens[this.index][2] == "=") {
        this.expt("IIPOP");
        this.match("=");
        this.expr_pacg();
        this.expt("POP");
        this.expt("STIIA");
        this.match(";");
      } else {
        this.expt("IPOP");
        this.expt("LDIA");
      }

    }

    this.bool_pacg = () => {
      let code_buffer = "";
      this.match("(");
      this.expr_pacg();
      if (tokens[this.index][2] == "==") {
        this.match("==");
        code_buffer = "EQ";
      } else if (tokens[this.index][2] == ">") {
        this.match(">");
        code_buffer = "GT";
      } else if (tokens[this.index][2] == "<") {
        this.match("<");
        code_buffer = "LT";
      } else if (tokens[this.index][2] == "!=") {
        this.match("!=");
        code_buffer = "NE";
      }
      this.expr_pacg();

      this.expt(code_buffer);

      this.match(")");
    }






    this.factor_pacg = () => { // ussually for pushing stuff like integers and stuff from identifiers to the stack to be handled later
      if (tokens[this.index][1] == 1) {
        this.expt("LDAD " + tokens[this.index][2]);
        this.expt("PUSH");
        this.index++;
      } else if (tokens[this.index][1] == 0) {
		  
		  if(tokens[this.index+1][2] != "("){
			this.expt("LDAM " + tokens[this.index][2]);
			 this.expt("PUSH");
			 this.index++;
		  }else{
		   this.expt("IIPUSH");
		    let token_id_call_buff = tokens[this.index][2];
            this.index++;
            this.match("(");
            let temporary_index_for_poping_stuff_off_the_stack = 0;
            while(tokens[this.index][2] != ")"){
                temporary_index_for_poping_stuff_off_the_stack++;
                this.expr_pacg();
                if(tokens[this.index][2] == ","){
                    this.index++;
                }
            }


			
            this.match(")");
			this.expt("CALL " + token_id_call_buff);
			this.expt("PUSH");
			this.expt("IPOP");
            this.expt("ADJP " + temporary_index_for_poping_stuff_off_the_stack);
			this.expt("IIPOP");
			this.expt("IPUSH ");
		  }
		 
      }else if(tokens[this.index][2] == "$"){
		  this.match("$");
		 this.expt("LDAD " + tokens[this.index][2]);
         this.expt("PUSH"); 
		 this.index++;
	  } else if (tokens[this.index][2] == "*") {
        this.pointer_pacg();
        this.expt("PUSH");
      }else if(tokens[this.index][2] == "arg"){
            this.match("arg");
            this.match("[");
            this.expt("IIPUSH");
            this.expt("BPTOII");
            this.expt("IIPUSH");
			this.expt("LDAD 3");
			this.expt("PUSH");
			this.expt("ADD");
            this.expr_pacg();
            this.expt("ADD");
            this.expt("IIPOP");
            this.expt("LDIIA");
            this.expt("IIPOP");
            this.expt("PUSH");
            this.match("]");
         
         
          /*
             asm{
       ADJM 900
       BPTOII
       IIPUSH
       LDAD 3
       PUSH
       ADD
       IIPOP
       LDIIA
       STAD 0
       ADJP 900
   };
          */
          }else if(tokens[this.index][2] == "bpa"){
            this.match("bpa");
            this.match("[");
            this.expt("IIPUSH");
            this.expt("BPTOII");
            this.expt("IIPUSH");
            this.expr_pacg();
            this.expt("SUB");
            this.expt("IIPOP");
            this.expt("LDIIA");
			this.expt("IIPOP");
            this.expt("PUSH");
            this.match("]");
          }else if (tokens[this.index][2] == "(") {
			 this.match("(");
			this.expr_pacg();
			this.match(")");
      }
    }

   
   

    this.term_pacg = () => {
      this.factor_pacg();
      while (["*", "/", "<<", ">>","%","^","|","&"].includes(tokens[this.index][2])) {
        if (tokens[this.index][2] == "*") {
          this.index++;
          this.factor_pacg();
          this.expt("MUL");
        } else if (tokens[this.index][2] == "/") {
          this.index++;
          this.factor_pacg();
          this.expt("DIV");
        }else if (tokens[this.index][2] == "%") {
          this.index++;
          this.factor_pacg();
          this.expt("MOD");
        }else if(tokens[this.index][2] == "^"){
          this.index++;
          this.factor_pacg();
          this.expt("XOR");
        }else if(tokens[this.index][2] == "|"){
          this.index++;
          this.factor_pacg();
          this.expt("OR");
        }else if(tokens[this.index][2] == "&"){
          this.index++;
          this.factor_pacg();
          this.expt("AND");
        }else if(tokens[this.index][2] == ">>"){
          this.index++;
          this.factor_pacg();
          this.expt("RS");
        }else if(tokens[this.index][2] == "<<"){
          this.index++;
          this.factor_pacg();
          this.expt("LS");
        }
      }
    }

    this.expr_pacg = () => {
      this.term_pacg();
      while (tokens[this.index][2] == "+" || tokens[this.index][2] == "-") {
        if (tokens[this.index][2] == "+") {
          this.index++;
          this.term_pacg();
          this.expt("ADD");
        } else if (tokens[this.index][2] == "-") {
          this.index++;
          this.term_pacg();
          this.expt("SUB");
        }
      }
    }


    this.if_pacg = () => {
      this.label_count++;
      let label_count_buffer = this.label_count;
      this.match("if");
      this.bool_pacg();
      this.expt("JNC L" + label_count_buffer);
      this.block_pacg();
      this.expt("LABEL L" + label_count_buffer);

      if (tokens[this.index][2] == "else") {
        this.match("else");
        if (tokens[this.index][2] == "if") {
          this.if_pacg();
        }
      }
    }

    this.block_pacg = () => {
      this.match("{");
      while (tokens[this.index][2] != "}") {
        if (tokens[this.index][2] == "*") {
          this.pointer_pacg();
        } else if (tokens[this.index][2] == "if") {
          this.if_pacg();

        } else if (tokens[this.index][2] == "while") {
          this.label_count++;
          let label_count_buffer = this.label_count;

          this.expt("JMP _L" + label_count_buffer); //Jump to main loop label comparison
          this.expt("LABEL L" + label_count_buffer); // main loop label

          let index_buffer_before = this.index;

          while (tokens[this.index][2] != "{") {//clear out the boolean condition
            this.index++;
          }


          this.block_pacg();
          let index_buffer_after = this.index;

          this.index = index_buffer_before;


          this.match("while");

          this.expt("LABEL _L" + label_count_buffer);
          this.bool_pacg();

          this.expt("JC L" + label_count_buffer);
          this.index = index_buffer_after;
        }else if(tokens[this.index][2] == "asm"){
          
            this.match("asm");
            this.expt(tokens[this.index][2]);
            this.index++;
                
        } else if (tokens[this.index][2] == "return") {
          this.match("return");
          this.expr_pacg();
          this.expt("POP");
          this.match(";");
        }else if(tokens[this.index][1] == 0 && tokens[this.index+1][2] == "("){
            let token_id_call_buff = tokens[this.index][2];
            this.index++;
            this.match("(");
            let temporary_index_for_poping_stuff_off_the_stack = 0;
            while(tokens[this.index][2] != ")"){
                temporary_index_for_poping_stuff_off_the_stack++;
                this.expr_pacg();
                if(tokens[this.index][2] == ","){
                    this.index++;
                }
            }

            this.expt("CALL " + token_id_call_buff);
            this.expt("ADJP " + temporary_index_for_poping_stuff_off_the_stack);
            this.match(")");
            this.match(";");
        }else if(tokens[this.index][1] == 0 && tokens[this.index+1][2] == "="){
            this.expt("LDAD " + tokens[this.index][2]);
            this.expt("PUSH");
            this.index++;
            this.expt("IIPOP");
            this.match("=");
            this.expr_pacg();
            this.expt("POP");
            this.expt("STIIA");
            this.match(";");
       
        }else if(tokens[this.index][2] == "bpa"){
            this.match("bpa");
            this.match("[");
            this.expt("IIPUSH");
            this.expt("BPTOII");
            this.expt("IIPUSH");
            this.expr_pacg();
			this.match("]");
            this.expt("SUB");
            this.expt("IIPOP");
			this.match("=");
            this.expr_pacg();
            this.expt("POP");
			this.expt("ADJP 1");
            this.expt("STIIA");
            
			
          }else if(tokens[this.index][2] == ";"){
            this.match(";");
        }
          /*else if(tokens[this.index][2] == "int"){
        // var_table['scope_name']['varible_name'] = {"varible_type":int|char|array,"varible_name": "varible_name","varible_bp_offset":int};
            this.match("int");
            this.type_match(0);
            this.bp_scope_count[this.current_scope]++;
            this.var_table[this.scope_name][tokens[this.index][2]].push( {"varible_type":"int","varible_name": tokens[this.index][2],"bp_off": this.bp_scope_count[this.current_scope]});
            let bp_off = this.bp_scope_count[this.current_scope];
            this.index++;
            if(tokens[this.index][2] == "="){
                  this.match("=");
                  this.expr_pacg();
                  this.expt("BPTOII");
                  this.expt("IIPUSH");
                  this.expt("LDAD "+ bp_off)
                  this.expt("PUSH");
                  this.expt("SUB");
                  this.expt("IIPOP");
                  this.expt("LDAD "+ tokens[this.index][2]);
                  this.expt("STIIA");
            }else if(tokens[this.index][2] == ";"){
                    this.match(";");
            }else{
                this.match(";");
                this.match("=");
            }
          
        }*/ else {
          this.log("Invalid usage of something ");
          console.log(tokens[this.index]);
          throw new error("Noooooooo");
        }
                 

      }
      this.match("}");
    }

    this.main_pacg = () => {
     
      this.expt("LABEL main")
      this.match("int");
      this.match("main");
      this.match("(");
      this.match(")");
      this.block_pacg();
      this.expt("LABEL end")
      this.expt("HLT");
    }
    this.var_pacg =() =>{
         this.expt("JMP main");
        while((tokens[this.index][2] == "char" || tokens[this.index][2] == "int") && tokens[this.index+1][2] != "main"){
           if(tokens[this.index][2] == "int"){
                this.match("int");
                this.expt("LABEL " + tokens[this.index][2]);
                this.index++;
                this.match("=");
                this.expt("HLT " + tokens[this.index][2]);
                 this.index++;
                this.match(";");
            }else if(tokens[this.index][2] == "char"){
                this.match("char");
                this.expt("LABEL " + tokens[this.index][2]);
                this.index++;
                this.match("=");
               
                let byte_arr = new TextEncoder().encode(tokens[this.index][2]);
               
               
                for(i =0; i< byte_arr.length; i++){
                    this.expt("HLT " + byte_arr[i]);
                }
               
                this.expt("HLT 0");
                this.index++;
                this.match(";");    
            }
        }
    }
    this.func_pacg = () =>{
        while(this.index<tokens.length&& tokens[this.index][2] == "int"){  
            this.match("int");
            this.expt("LABEL " + tokens[this.index][2]);
            this.index++;
            this.match("(");
            this.match(")");
            this.block_pacg();
            this.expt("RET");
        }
        this.expt("HLT");

    }
   
   
    this.var_pacg();//temporary solution using global varibles to do stuff. can only store numbers
    this.main_pacg();
    this.func_pacg();
    return ASM;
  }

  //console.log(this.parse_gen(lexer(code)));
  console.log(lexer(code))
  return this.parse_gen(lexer(code)).replaceAll("PUSH\nPOP\n","");
}

/*
//prints capitilized abcs
int main(){
*(400) =0;
while(*(400) < 32){
*(*(400)) = *(400)+65;
*(400)  =*(400)+1;
}
return 0;
}
*/




/*
//assmebly block subrouteines
int main(){
   *(900) = 0;
   asm{CALL addition}
   asm{HLT}
   asm{LABEL addition}
   *(900) = *(900) + 90;
   asm{RET}
}
*/



/*
//parameter test
int main(){
  
   asm{
ADJM 900
      LDAD 80
      PUSH
      LDAD 0
      CALL test
ADJP 900
      }
   asm{HLT};
   asm{LABEL test};
   asm{
       ADJM 900
       BPTOII
       IIPUSH
       LDAD 3
       PUSH
       ADD
       IIPOP
       LDIIA
       STAD 0
       ADJP 900
   };
   asm{RET};
}
//better parameter check
int main(){
k(90);
}
int k(){
*(0) = arg[9];
}
*/