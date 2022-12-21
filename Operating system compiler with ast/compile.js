//compile.js
function compile(code) {
    this.ast = {
        sym_table: {},
        program: []
    };
    let ast_access_program_end = () => {
        return this.ast.program[this.ast.program.length - 1];
    }



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
        let multi_sym = ["-", "*", "+", "=", "<", "!", ">", "%", "^", "|", "&", "$"];
        let symbols = ["[", "]", ",", "(", ")", "{", "}", ";"];
        let keywords = ["while", "if", "for", "main", "int", "return", "asm", "arg", "char", "global", "bpa","struct"];
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
                    tokens.push([
                        [col, row], 0, keep_track
                    ]);
                    keep_track = "";
                }

            } else {
                keep_track += code[i];
            }


            if (multi_sym.includes(keep_track)) {
                if (code[i + 1] == "=") {
                    keep_track += code[++i];
                    tokens.push([
                        [col, row], 3, keep_track
                    ]);
                    keep_track = "";
                } else if (code[i + 1] == ">") {
                    keep_track += code[++i];
                    tokens.push([
                        [col, row], 3, keep_track
                    ]);
                    keep_track = "";
                } else if (code[i + 1] == "<") {
                    keep_track += code[++i];
                    tokens.push([
                        [col, row], 3, keep_track
                    ]);
                    keep_track = "";
                } else {
                    tokens.push([
                        [col, row], 3, keep_track
                    ]);
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
                tokens.push([
                    [col, row], 1, keep_track
                ]);
                keep_track = "";
            }


            if (symbols.includes(keep_track)) {
                tokens.push([
                    [col, row], 3, keep_track
                ]);
                keep_track = "";
            }


            if (keywords.includes(keep_track)) {
                tokens.push([
                    [col, row], 2, keep_track
                ]);

                if (keep_track == "asm") {
                    keep_track = "";
                    i++;
                    i++;
                    while (code[i] != '}') {
                        keep_track += code[i];
                        i++;
                    }
                    tokens.push([
                        [col, row], 2, keep_track
                    ]);
                    i++;
                }
                keep_track = "";

            }


            if (keep_track == "\"") { // string handliation
                keep_track = "";
                i++;
                while (code[i] != "\"") {
                    keep_track += code[i];
                    row++;
                    i++;
                }
                tokens.push([
                    [col, row], 4, keep_track
                ]);
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

        this.pointer_pacg = (ref) => {
            this.match("*");
            if (tokens[this.index][2] == "(") {
                this.match("(");
            }
            ref.mem_location.push({
                type: "pointer_addr",
                expr: []
            });
            this.expr_pacg(ref.mem_location[ref.mem_location.length - 1]);

            if (tokens[this.index][2] == ")") {
                this.match(")");
            }

            if (tokens[this.index][2] == "=") {

                this.match("=");
                this.expr_pacg(ref.value);


                this.match(";");
            } else {


            }

        }

        this.bool_pacg = (ref) => {
            let code_buffer = "";
            this.match("(");
            this.expr_pacg(ref.expr_1);
            ref.condition = tokens[this.index][2];
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

            this.expr_pacg(ref.expr_2);
            ref.cond_ins = code_buffer
            this.match(")");
        }




        this.factor_pacg = (ref) => { // ussually for pushing stuff like integers and stuff from identifiers to the stack to be handled later
            if (tokens[this.index][1] == 1) { //int lit
                ref.expr.push({
                    type: "int_lit",
                    name: tokens[this.index][2]
                });


                this.index++;

            } else if (tokens[this.index][1] == 0) { //function call and identifier parse

                if (tokens[this.index + 1][2] != "(" && tokens[this.index + 1][2] != "[") { //identifier direct acess parse
                    ref.expr.push({
                        type: "identifier_direct",
                        name: tokens[this.index][2]
                    });


                    this.index++;
                } else if (tokens[this.index + 1][2] == "(") { //function call parse

                    let token_id_call_buff = tokens[this.index][2];
                    ref.expr.push({
                        type: "function_call",
                        name: tokens[this.index][2],
                        parameters: []
                    });
                    this.index++;
                    this.match("(");
                    let temporary_index_for_poping_stuff_off_the_stack = 0;
                    while (tokens[this.index][2] != ")") {
                        temporary_index_for_poping_stuff_off_the_stack++;
                        ref.expr[ref.expr.length - 1].parameters.push({
                            expr: []
                        });


                        this.expr_pacg(ref.expr[
                            ref.expr.length - 1].parameters[
                            temporary_index_for_poping_stuff_off_the_stack - 1
                        ]);



                        if (tokens[this.index][2] == ",") {
                            this.index++;
                        }
                    }
                    this.match(")");
                } else if (tokens[this.index + 1][2] == "[") {
                    ref.expr.push({
                        type: "identifier_direct_arr",
                        name: tokens[this.index][2],
                        expr: []
                    });
                    this.index++
                    this.match("[");
                    this.expr_pacg(ref.expr[ref.expr.length - 1]);
                    this.match("]");
                }

            } else if (tokens[this.index][2] == "$") {
                ref.expr.push({
                    type: "identifier_mem_loc",
                    name: tokens[this.index + 1][2]
                });
                this.match("$");



                this.index++;
            } else if (tokens[this.index][2] == "*") {
                ref.expr.push({
                    type: "pointer_read",
                    mem_location: []
                });
                this.pointer_pacg(ref.expr[ref.expr.length - 1]);

            } else if (tokens[this.index][2] == "arg") {
                ref.expr.push({
                    type: "arg_read",
                    expr: []
                });
                this.match("arg");
                this.match("[");




                this.expr_pacg(ref.expr[ref.expr.length - 1]);




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
            } else if (tokens[this.index][2] == "bpa") {
                ref.expr.push({
                    type: "bpa_expr",
                    expr: []
                });
                this.match("bpa");
                this.match("[");



                this.expr_pacg(ref.expr[ref.expr.length - 1]);




                this.match("]");
            } else if (tokens[this.index][2] == "(") {
                this.match("(");
                this.expr_pacg(ref);
                this.match(")");
            }


        }




        this.term_pacg = (ref) => {
            this.factor_pacg(ref);

            while (["*", "/", "<<", ">>", "%", "^", "|", "&"].includes(tokens[this.index][2])) {
                let op_buf = tokens[this.index][2];
                if (tokens[this.index][2] == "*") {
                    this.index++;
                    this.factor_pacg(ref);

                } else if (tokens[this.index][2] == "/") {
                    this.index++;
                    this.factor_pacg(ref);

                } else if (tokens[this.index][2] == "%") {
                    this.index++;
                    this.factor_pacg(ref);

                } else if (tokens[this.index][2] == "^") {
                    this.index++;
                    this.factor_pacg(ref);

                } else if (tokens[this.index][2] == "|") {
                    this.index++;
                    this.factor_pacg(ref);

                } else if (tokens[this.index][2] == "&") {
                    this.index++;
                    this.factor_pacg(ref);

                } else if (tokens[this.index][2] == ">>") {
                    this.index++;
                    this.factor_pacg(ref);

                } else if (tokens[this.index][2] == "<<") {
                    this.index++;
                    this.factor_pacg(ref);

                }
                ref.expr.push({
                    type: "binary_2",
                    name: op_buf
                });

            }
        }

        this.expr_pacg = (ref) => {
            this.term_pacg(ref);
            while (tokens[this.index][2] == "+" || tokens[this.index][2] == "-") {
                let op_buf = tokens[this.index][2];
                if (tokens[this.index][2] == "+") {

                    this.index++;
                    this.term_pacg(ref);


                } else if (tokens[this.index][2] == "-") {
                    this.index++;
                    this.term_pacg(ref);

                }
                ref.expr.push({
                    type: "binary_1",
                    name: op_buf
                });

            }
        }


        this.if_pacg = (ref) => {
            this.label_count++;
            let label_count_buffer = this.label_count;
            this.match("if");
            ref.block.push({
                type: "if",
                block: [],
                condition: "",
                expr_1: {
                    expr: []
                },
                expr_2: {
                    expr: []
                },
                cond_ins: ""
            });
            this.bool_pacg(ref.block[ref.block.length - 1]);

            this.block_pacg(ref.block[ref.block.length - 1]);


            if (tokens[this.index][2] == "else") {
                this.match("else");
                if (tokens[this.index][2] == "if") {
                    this.if_pacg();
                }
            }
        }

        this.block_pacg = (ref) => {
            let current_scope = ast_access_program_end().name;
            this.match("{");
            while (tokens[this.index][2] != "}") {
                if (tokens[this.index][2] == "*") {
                    ref.block.push({
                        type: "pointer_write",
                        mem_location: [],
                        value: {
                            expr: []
                        },
                        cond_ins: ""
                    });
                    this.pointer_pacg(ref.block[ref.block.length - 1]);
                } else if (tokens[this.index][2] == "if") {
                    this.if_pacg(ref);

                } else if (tokens[this.index][2] == "while") {
                    this.label_count++;
                    let label_count_buffer = this.label_count;




                    let index_buffer_before = this.index;

                    while (tokens[this.index][2] != "{") { //clear out the boolean condition
                        this.index++;
                    }

                    ref.block.push({
                        type: "while",
                        block: [],
                        condition: "",
                        expr_1: {
                            expr: []
                        },
                        expr_2: {
                            expr: []
                        },
                        cond_ins: ""
                    });
                    this.block_pacg(ref.block[ref.block.length - 1]);
                    let index_buffer_after = this.index;

                    this.index = index_buffer_before;


                    this.match("while");


                    this.bool_pacg(ref.block[ref.block.length - 1]);


                    this.index = index_buffer_after;
                } else if (tokens[this.index][2] == "asm") {

                    this.match("asm");
                    ref.block.push({
                        type: "asm_blk",
                        contents: tokens[this.index][2]
                    });

                    this.index++;

                } else if (tokens[this.index][2] == "return") {
                    ref.block.push({
                        type: "return",
                        expr: []
                    });
                    this.match("return");
                    this.expr_pacg(ref.block[ref.block.length - 1]);
                    this.match(";");
                } else if (tokens[this.index][1] == 0 && tokens[this.index + 1][2] == "(") {
                    ref.block.push({
                        type: "function_call",
                        name: tokens[this.index][2],
                        parameters: []
                    });
                    let token_id_call_buff = tokens[this.index][2];
                    this.index++;
                    this.match("(");
                    let temporary_index_for_poping_stuff_off_the_stack = 0;
                    while (tokens[this.index][2] != ")") {
                        temporary_index_for_poping_stuff_off_the_stack++;
                        ref.block[ref.block.length - 1].parameters.push({
                            expr: []
                        });
                        this.expr_pacg(ref.block[ref.block.length - 1].parameters[temporary_index_for_poping_stuff_off_the_stack - 1]);

                        if (tokens[this.index][2] == ",") {
                            this.index++;
                        }
                    }



                    this.match(")");
                    this.match(";");
                } else if (tokens[this.index][1] == 0 && tokens[this.index + 1][2] == "=") {
                    ref.block.push({
                        type: "identifier_write",
                        name: tokens[this.index][2],
                        expr: []
                    });
                    this.index++;
                    this.match("=");
                    this.expr_pacg(ref.block[ref.block.length - 1]);
                    this.match(";");

                } else if (tokens[this.index][1] == 0 && tokens[this.index + 1][2] == "[") {
                    ref.block.push({
                        type: "identifier_write_arr",
                        name: tokens[this.index][2],
                        addr_access: {
                            expr: []
                        },
                        expr: []
                    });
                    this.index++;
                    this.match("[");
                    this.expr_pacg(ref.block[ref.block.length - 1].addr_access);
                    this.match("]");
                    this.match("=");
                    this.expr_pacg(ref.block[ref.block.length - 1]);
                    this.match(";");
                } else if (tokens[this.index][2] == "bpa") {



                    ref.block.push({
                        type: "bpa_write",
                        offset: {
                            expr: []
                        },
                        value: {
                            expr: []
                        }
                    });
                    this.match("bpa");
                    this.match("[");



                    this.expr_pacg(ref.block[ref.block.length - 1].offset);
                    this.match("]");


                    this.match("=");
                    this.expr_pacg(ref.block[ref.block.length - 1].value);




                } else if (tokens[this.index][2] == ";") {
                    this.match(";");
                } else if (tokens[this.index][2] == "int") {

                    this.match("int");
                    if (tokens[this.index + 1][2] != "[") {
                        ast_access_program_end().block.push({
                            type: "int_var_local_set",
                            name: tokens[this.index][2],
                            value: {
                                expr: []
                            },
                            scope: ast_access_program_end().name,
                            bpc: ast_access_program_end().bpc
                        });




                        this.ast.sym_table[tokens[this.index][2] + "_" + ast_access_program_end().name] = {
                            type: "int_var_local",
                            name: tokens[this.index][2] + "_" + ast_access_program_end().name,
                            value: ast_access_program_end().block[ast_access_program_end().block.length - 1].value,
                            scope: ast_access_program_end().name,
                            bpc: ast_access_program_end().bpc

                        };

                        this.index++;
                        this.match("=");
                        this.expr_pacg(ast_access_program_end().block[ast_access_program_end().block.length - 1].value);
                        this.match(";");
                        ast_access_program_end().bpc++;
                    }else{
                       
                        ast_access_program_end().block.push({
                            type: "int_var_arr_local_set",
                            name: tokens[this.index][2],
                            scope: ast_access_program_end().name,
                            bpc: ast_access_program_end().bpc
                        });
                       
                       
                        this.ast.sym_table[tokens[this.index][2] + "_" + ast_access_program_end().name] = {
                            type: "int_var_local",
                            name: tokens[this.index][2] + "_" + ast_access_program_end().name,
                            value: ast_access_program_end().block[ast_access_program_end().block.length - 1].value,
                            scope: ast_access_program_end().name,
                            bpc: ast_access_program_end().bpc

                        };
                        this.index++;
                        this.match("[");
                        ast_access_program_end().bpc+=parseInt(tokens[this.index][2]);
                        this.index++;
                        this.match("]");
                        this.match(";");
                    }


                } else if (tokens[this.index][2] == "char") {
//char start
                    this.match("char");
                    if (tokens[this.index + 1][2] != "[") {
                       
                        ast_access_program_end().block.push({
                            type: "char_var_local_set",
                            name: tokens[this.index][2],
                            value: tokens[this.index+2][2],
                            scope: ast_access_program_end().name,
                            bpc: ast_access_program_end().bpc
                        });




                        this.ast.sym_table[tokens[this.index][2] + "_" + ast_access_program_end().name] = {
                            type: "char_var_local",
                            name: tokens[this.index][2] + "_" + ast_access_program_end().name,
                            scope: ast_access_program_end().name,
                            bpc: ast_access_program_end().bpc

                        };

                        this.index++;
                        this.match("=");
                        this.index++;
                        this.match(";");
                        ast_access_program_end().bpc+=tokens[this.index-2][2].length+2;
                    }else{
                       
                        ast_access_program_end().block.push({
                            type: "char_var_arr_local_set",
                            name: tokens[this.index][2],
                            scope: ast_access_program_end().name,
                            bpc: ast_access_program_end().bpc
                        });
                       
                       
                        this.ast.sym_table[tokens[this.index][2] + "_" + ast_access_program_end().name] = {
                            type: "char_var_local",
                            name: tokens[this.index][2] + "_" + ast_access_program_end().name,
                            value: ast_access_program_end().block[ast_access_program_end().block.length - 1].value,
                            scope: ast_access_program_end().name,
                            bpc: ast_access_program_end().bpc

                        };
                        this.index++;
                        this.match("[");
                        ast_access_program_end().bpc+=parseInt(tokens[this.index][2]);
                        this.index++;
                        this.match("]");
                        this.match(";");
                    }

//char end
                } else {
                    this.log("Invalid usage of something ");
                    console.log(tokens[this.index]);
                    throw new error("Noooooooo");
                }


            }
            this.match("}");
        }

        this.main_pacg = () => {
            this.ast.program.push({
                type: "function",
                name: "main",
                block: [],
                bpc: 0
            });
            this.ast.sym_table["main"] = {
                type: "function",
                name: "main"
            };

            this.match("int");
            this.match("main");
            this.match("(");
            this.match(")");


            ast_access_program_end().block.push({
                type: "stack_adjust_m",
                stk_a: 0
            });

            this.block_pacg(ast_access_program_end(), "main");


            ast_access_program_end().block.push({
                type: "stack_adjust_p",
                stk_a: ast_access_program_end().bpc
            });

            ast_access_program_end().block[0].stk_a = ast_access_program_end().bpc;

        }
        this.var_pacg = () => {

            while ((tokens[this.index][2] == "char" || tokens[this.index][2] == "int") && tokens[this.index + 1][2] != "main") {

                if (tokens[this.index][2] == "int") {

                    this.match("int");
                    if (tokens[this.index + 1][2] != "[") {
                        this.ast.program.push({
                            type: "int_var_global",
                            name: tokens[this.index][2],
                            value: tokens[this.index + 2][2]
                        });


                        this.ast.sym_table[tokens[this.index][2]] = {
                            type: "int_var_global",
                            name: tokens[this.index][2],
                            value: tokens[this.index + 2][2],
                            scope: "global"
                        };
                        this.index++;
                        this.match("=");
                        this.index++;
                    } else {
                        this.ast.program.push({
                            type: "int_var_array_global",
                            name: tokens[this.index][2],
                            array_entries: tokens[this.index + 2][2]
                        });


                        this.ast.sym_table[tokens[this.index][2]] = {
                            type: "int_var_array_global",
                            name: tokens[this.index][2],
                            array_entries: tokens[this.index + 2][2],
                            scope: "global"
                        };
                        this.index++;
                        this.match("[");
                        this.index++;
                        this.match("]");
                    }

                    this.match(";");

                } else if (tokens[this.index][2] == "char") {

                    this.match("char");

                    if (tokens[this.index + 1][2] != "[") {
                        this.ast.program.push({
                            type: "char_var_global",
                            name: tokens[this.index][2],
                            value: tokens[this.index + 2][2]
                        });


                        this.ast.sym_table[tokens[this.index][2]] = {
                            type: "char_var_global",
                            name: tokens[this.index][2],
                            value: tokens[this.index + 2][2],
                            scope: "global"
                        };
                        this.index++;
                        this.match("=");
                        this.index++;
                    } else {
                        this.ast.program.push({
                            type: "char_var_array_global",
                            name: tokens[this.index][2],
                            array_entries: tokens[this.index + 2][2]
                        });
                        this.ast.sym_table[tokens[this.index][2]] = {
                            type: "char_var_array_global",
                            name: tokens[this.index][2],
                            array_entries: tokens[this.index + 2][2],
                            scope: "global"
                        };
                        this.index++;
                        this.match("[");
                        this.index++;
                        this.match("]");

                    }

                    this.match(";");
                }
            }
        }
       
           
           
        
        this.func_pacg = () => {
            while (this.index < tokens.length && tokens[this.index][2] == "int") {

                this.match("int");
                this.ast.program.push({
                    type: "function",
                    name: tokens[this.index][2],
                    block: [],
                    bpc: 0
                });
                ast_access_program_end().block.push({
                    type: "stack_adjust_m",
                    stk_a: 0
                });
                this.ast.sym_table[tokens[this.index][2]] = {
                    type: "function",
                    name: tokens[this.index][2]
                };

                this.index++;
                this.match("(");
                this.match(")");
                this.block_pacg(ast_access_program_end());
                ast_access_program_end().block.push({
                    type: "stack_adjust_p",
                    stk_a: ast_access_program_end().bpc
                });
                ast_access_program_end().block[0].stk_a = ast_access_program_end().bpc;
            }


        }


        this.var_pacg(); //temporary solution using global varibles to do stuff. can only store numbers
        this.main_pacg();
        this.func_pacg();
        //console.log(JSON.stringify(this.ast,null,2));
        ASM = this.ast_to_asm(this.ast);
        return ASM;

    }

    this.ast_to_asm = (ast) => {
        let label_count = 0;
        let asm = "";

        let expt = (str) => {
            asm += str + '\n';
        }
        expt("JMP main")
        let program = ast.program;
        let sym_table = ast.sym_table;


        let bool_gen = (current_bool, scope) => {
            expr_gen(current_bool.expr_1.expr, scope);
            expr_gen(current_bool.expr_2.expr, scope);
            expt(current_bool.cond_ins);
        }


        let expr_gen = (current_expr, scope) => {
            let pc_expr = 0;

            while (pc_expr < current_expr.length) {
                let type = current_expr[pc_expr].type;
                if (type == "int_lit") {
                    expt("LDAD " + current_expr[pc_expr].name);
                    expt("PUSH");
                } else if (type == "pointer_read") {
                    expr_gen(current_expr[pc_expr].mem_location[0].expr, scope);
                    expt("IPOP");
                    expt("LDIA");
                    expt("PUSH");
                } else if (type == "bpa_expr") {
                    expt("IIPUSH");
                    expt("BPTOII");
                    expt("IIPUSH");
                    expr_gen(current_expr[pc_expr].expr, scope);
                    expt("SUB");
                    expt("IIPOP");
                    expt("LDIIA");
                    expt("IIPOP");
                    expt("PUSH");
                } else if (type == "arg_read") {
                    expt("IIPUSH");
                    expt("BPTOII");
                    expt("IIPUSH");
                    expt("LDAD 3");
                    expt("PUSH");
                    expt("ADD");
                    expr_gen(current_expr[pc_expr].expr, scope);
                    expt("ADD");
                    expt("IIPOP");
                    expt("LDIIA");
                    expt("IIPOP");
                    expt("PUSH");
                } else if (type == "identifier_direct") {
                    if (sym_table[current_expr[pc_expr].name + "_" + scope] == undefined) {
                        expt("LDAM " + current_expr[pc_expr].name);
                        expt("PUSH");
                    } else {
                        expt("IIPUSH");
                        expt("BPTOII");
                        expt("IIPUSH");
                        expt("LDAD " + sym_table[current_expr[pc_expr].name + "_" + scope].bpc);
                        expt("PUSH");
                        expt("SUB");
                        expt("IIPOP");
                        expt("LDIIA");
                        expt("IIPOP");
                        expt("PUSH");
                    }

                } else if (type == "function_call") {
                    expt("IIPUSH");
                    for (i = 0; i < current_expr[pc_expr].parameters.length; i++) {
                        expr_gen(current_expr[pc_expr].parameters[i].expr, scope);
                    }

                    expt("CALL " + current_expr[pc_expr].name);
                    expt("PUSH");
                    expt("IPOP");
                    expt("ADJP " + current_expr[pc_expr].parameters.length);
                    expt("IIPOP");
                    expt("IPUSH ");

                } else if (type == "identifier_mem_loc") {
                    if (sym_table[current_expr[pc_expr].name + "_" + scope] == undefined) {
                        expt("LDAD " + current_expr[pc_expr].name);
                        expt("PUSH");
                    } else {
                        expt("IIPUSH");
                        expt("BPTOII");
                        expt("IIPUSH");
                        expt("LDAD " + sym_table[current_expr[pc_expr].name + "_" + scope].bpc);
                        expt("PUSH");
                        expt("SUB");
						expt("POP");
				        expt("IIPOP");
						expt("PUSH");

                    }
                } else if (type == "identifier_direct_arr") {
                    if (sym_table[current_expr[pc_expr].name + "_" + scope] == undefined) {
                        expt("LDAD " + current_expr[pc_expr].name);
                        expt("PUSH");
                        expr_gen(current_expr[pc_expr].expr, scope);
                        expt("ADD");
                        expt("IPOP");
                        expt("LDIA");
                        expt("PUSH");
                    }else{
                        expt("IIPUSH");
                        expt("BPTOII");
                        expt("IIPUSH");
                        expt("LDAD " + sym_table[current_expr[pc_expr].name + "_" + scope].bpc);
                        expt("PUSH");
                        expt("SUB");
                        expr_gen(current_expr[pc_expr].expr, scope);
                        expt("SUB");                        
                        expt("IIPOP");
                        expt("LDIIA");
                        expt("IIPOP");
                        expt("PUSH");                        
                     }
                } else if (type == "binary_1" || type == "binary_2") {
                    let operations = {
                        "*": "MUL",
                        "/": "DIV",
                        "<<": "LS",
                        ">>": "RS",
                        "%": "MOD",
                        "^": "XOR",
                        "|": "OR",
                        "&": "AND",
                        "+": "ADD",
                        "-": "SUB"
                    };
                    expt(operations[current_expr[pc_expr].name]);
                }
                pc_expr++;
            }
        }


        let blk_gen = (current_blk, scope) => {
            for (let pc_blk = 0; pc_blk < current_blk.length; pc_blk++) {
                if (current_blk[pc_blk].type == "pointer_write") {
                    expr_gen(current_blk[pc_blk].mem_location[0].expr, scope);
                    expt("IIPOP");
                    expr_gen(current_blk[pc_blk].value.expr, scope);
                    expt("POP");
                    expt("STIIA");
                } else if (current_blk[pc_blk].type == "bpa_write") {
                    expt("BPTOII");
                    expt("IIPUSH");
                    expr_gen(current_blk[pc_blk].offset.expr, scope);
                    expt("SUB");
                    expt("IIPOP");
                    expr_gen(current_blk[pc_blk].value.expr, scope);
                    expt("POP");
                    expt("STIIA");
                } else if (current_blk[pc_blk].type == "identifier_write") {
                    if (sym_table[current_blk[pc_blk].name + "_" + scope] == undefined) {
                        expt("LDAD " + current_blk[pc_blk].name);
                        expt("PUSH");
                        expt("IIPOP");
                        expr_gen(current_blk[pc_blk].expr, scope);
                        expt("POP");
                        expt("STIIA");
                    } else {
                        expt("BPTOII");
                        expt("IIPUSH");
                        expt("LDAD " + sym_table[current_blk[pc_blk].name + "_" + scope].bpc);
                        expt("PUSH");
                        expt("SUB");
                        expt("IIPOP");
                        expr_gen(current_blk[pc_blk].expr, scope);
                        expt("POP");
                        expt("STIIA");
                    }
                } else if (current_blk[pc_blk].type == "identifier_write_arr") {
                    if(sym_table[current_blk[pc_blk].name + "_" + scope]  == undefined){
                        expt("LDAD " + current_blk[pc_blk].name);
                        expt("PUSH");
                        expr_gen(current_blk[pc_blk].addr_access.expr, scope);
                        expt("ADD");
                        expt("IIPOP");
                        expr_gen(current_blk[pc_blk].expr, scope);
                        expt("POP");
                        expt("STIIA");
                    }else{
                        expt("BPTOII");
                        expt("IIPUSH");
                        expt("LDAD " + sym_table[current_blk[pc_blk].name + "_" + scope].bpc);
                        expt("PUSH");
                        expt("SUB");
                        expr_gen(current_blk[pc_blk].addr_access.expr, scope);
                        expt("SUB");          
                        expt("IIPOP");
                        expr_gen(current_blk[pc_blk].expr, scope);
                        expt("POP");
                        expt("STIIA");
                    }
                } else if (current_blk[pc_blk].type == "if") {
                    label_count++;
                    let label_count_buffer = label_count;
                    bool_gen(current_blk[pc_blk]);
                    expt("JNC L" + label_count_buffer);
                    blk_gen(current_blk[pc_blk].block, scope);
                    expt("LABEL L" + label_count_buffer);
                } else if (current_blk[pc_blk].type == "while") {
                    label_count++;
                    let label_count_buffer = label_count;

                    expt("JMP _L" + label_count_buffer); //Jump to main loop label comparison
                    expt("LABEL L" + label_count_buffer); // main loop label

                    blk_gen(current_blk[pc_blk].block, scope);
                    expt("LABEL _L" + label_count_buffer);
                    bool_gen(current_blk[pc_blk], scope);
                    expt("JC L" + label_count_buffer);
                } else if (current_blk[pc_blk].type == "asm_blk") {
                    expt(current_blk[pc_blk].contents);
                } else if (current_blk[pc_blk].type == "function_call") {

                    for (i = 0; i < current_blk[pc_blk].parameters.length; i++) {
                        expr_gen(current_blk[pc_blk].parameters[i].expr, scope);
                    }

                    expt("CALL " + current_blk[pc_blk].name);
                    expt("ADJP " + current_blk[pc_blk].parameters.length);
                } else if (current_blk[pc_blk].type == "int_var_local_set") {

                    expt("BPTOII");
                    expt("IIPUSH");
                    expt("LDAD " + sym_table[current_blk[pc_blk].name + "_" + scope].bpc);
                    expt("PUSH");
                    expt("SUB");
                    expt("IIPOP");
                    expr_gen(current_blk[pc_blk].value.expr, scope);
                    expt("POP");
                    expt("STIIA");
                } else if (current_blk[pc_blk].type == "stack_adjust_m") {
                        expt("ADJM " + current_blk[pc_blk].stk_a);
                }else if (current_blk[pc_blk].type == "stack_adjust_p") {
                        expt("ADJP " + current_blk[pc_blk].stk_a);
                }else if(current_blk[pc_blk].type == "char_var_local_set"){
                   
                   
                expt("BPTOII");
                expt("IIPUSH ");
                expt("LDAD " + sym_table[current_blk[pc_blk].name + "_" + scope].bpc);
                expt("PUSH");
                expt("SUB");
                let byte_arr = new TextEncoder().encode(current_blk[pc_blk].value);
                for (i = 0; i < byte_arr.length; i++) {

                   
                    expt("IIPOP");
                    expt("LDAD " + byte_arr[i]);
                    expt("STIIA");
                    expt("IIPUSH ");
                    expt("LDAD 1");
                    expt("PUSH");
                    expt("SUB");
                }                  
                    expt("IIPOP");
                    expt("LDAD 0");
                    expt("STIIA");
                    expt("IIPUSH ");
                    expt("LDAD 1");
                    expt("PUSH");
                    expt("SUB");
                }else if (current_blk[pc_blk].type == "return") {
                    expr_gen(current_blk[pc_blk].expr, scope);
                    expt("POP");
                }
            }
        }



        for (pc = 0; pc < program.length; pc++) {
            if (program[pc].type == "int_var_global") {
                expt("LABEL " + program[pc].name);
                expt("HLT " + program[pc].value);
            } else if (program[pc].type == "char_var_global") {
                let byte_arr = new TextEncoder().encode(program[pc].value);
                expt("LABEL " + program[pc].name);
                for (i = 0; i < byte_arr.length; i++) {
                    expt("HLT " + byte_arr[i]);
                }

                expt("HLT 0");
            } else if (program[pc].type == "int_var_array_global") {
                expt("LABEL " + program[pc].name);
                expt("HLT 0\n".repeat(parseInt(program[pc].array_entries)));
            } else if (program[pc].type == "char_var_array_global") {
                expt("LABEL " + program[pc].name);
                expt("HLT 0\n".repeat(parseInt(program[pc].array_entries)));
                expt("HLT 0");
            } else if (program[pc].name == "main") {
                expt("LABEL main");
                blk_gen(program[pc].block, "main");
                expt("LABEL end");
                expt("HLT 0");
            } else if (program[pc].type == "function") {
                expt("LABEL " + program[pc].name);
                blk_gen(program[pc].block, program[pc].name);
                expt("RET");
            }
        }
        expt("HLT 0");

        console.log(JSON.stringify(ast, null, 2));
        return asm;

    }

    //console.log(this.parse_gen(lexer(code)));
    //console.log(this.ast);
    return this.parse_gen(lexer(code)).replaceAll("PUSH\nPOP\n", "")
        .replaceAll("BPTOII\nIIPUSH\nLDAD 0\nPUSH\nSUB", "BPTOII\nIIPUSH")
        .replaceAll("IIPUSH\nIIPOP\n", "")
        .replaceAll("BPTOII\nIIPUSH\nLDAD 3\nPUSH\nADD\nLDAD 0\nPUSH\nADD", "BPTOII\nIIPUSH\nLDAD 3\nPUSH\nADD")
        .replaceAll("ADJP 0", "")
        .replaceAll("ADJM 0", "")
        .replaceAll("PUSH\nIPOP", "SIXAX")
        .replaceAll("PUSH\nIIPOP", "SIIXAX");

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
