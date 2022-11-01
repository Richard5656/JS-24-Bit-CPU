
int main(){
//400-600 are for varibles
//700 - 715  //storage for IO params
//2000 all temporary storage
//1100 - 1400 are for constants //mostly storing commands
//12001-13000 are pointers to the beginning of files
//14000 - 19000 are the file locations
//12000 - how many files
//11990 - fp pointer to file innards to edit them
//11998 - file location storage. reminder it is like a simple allocater that does not deallocate.
//3000 - 7000 filesystem
//9000-10000 execution space to boot program
//filesystem every file will be quadruple null terminated. Why? Becaue I said so.
//file header struct format //Not actually implemtnable
//struct fh{  char name[4];int start_of_file; int type;int is_executable;} //type 0 text, type 1 executable
//file location pointer - can point to the head of the file throught the entire file.
//each file block is 24 cpu words
//all files end in 4 null terminatated to signify its end
//Terry a davis probably doesn't approve of any of this
    asm{
        LDAD 66
        STAD 0
        LDAD 111
        STAD 1
        LDAD 111
        STAD 2
        LDAD 116
        STAD 3
        LDAD 105
        STAD 4
        LDAD 110
        STAD 5
        LDAD 103
        STAD 6
        LDAD 46
        STAD 7
        LDAD 46
        STAD 8
        LDAD 46
        STAD 9
};
asm{
        LDAD 87
        STAD 32
        LDAD 114
        STAD 33
        LDAD 105
        STAD 34
        LDAD 116
        STAD 35
        LDAD 101
        STAD 36
        LDAD 32
        STAD 37
        LDAD 105
        STAD 38
        LDAD 110
        STAD 39
        LDAD 116
        STAD 40
        LDAD 111
        STAD 41
        LDAD 32
        STAD 42
        LDAD 112
        STAD 43
        LDAD 111
        STAD 44
        LDAD 114
        STAD 45
        LDAD 116
        STAD 46
        LDAD 32
        STAD 47
        LDAD 49
        STAD 48
        LDAD 32
        STAD 49
        LDAD 116
        STAD 50
        LDAD 104
        STAD 51
        LDAD 101
        STAD 52
        LDAD 32
        STAD 53
        LDAD 100
        STAD 54
        LDAD 114
        STAD 55
        LDAD 105
        STAD 56
        LDAD 118
        STAD 57
        LDAD 101
        STAD 58
        LDAD 32
        STAD 59
        LDAD 121
        STAD 60
        LDAD 111
        STAD 61
        LDAD 117
        STAD 62
        LDAD 32
        STAD 63
        LDAD 119
        STAD 64
        LDAD 97
        STAD 65
        LDAD 110
        STAD 66
        LDAD 116
        STAD 67
        LDAD 32
        STAD 68
        LDAD 116
        STAD 69
        LDAD 111
        STAD 70
        LDAD 32
        STAD 71
        LDAD 98
        STAD 72
        LDAD 111
        STAD 73
        LDAD 111
        STAD 74
        LDAD 116
        STAD 75
        LDAD 46
        STAD 76
        LDAD 32
        STAD 77
        LDAD 40
        STAD 78
        LDAD 87
        STAD 79
        LDAD 105
        STAD 80
        LDAD 108
        STAD 81
        LDAD 108
        STAD 82
        LDAD 32
        STAD 83
        LDAD 108
        STAD 84
        LDAD 111
        STAD 85
        LDAD 97
        STAD 86
        LDAD 100
        STAD 87
        LDAD 32
        STAD 88
        LDAD 105
        STAD 89
        LDAD 110
        STAD 90
        LDAD 116
        STAD 91
        LDAD 111
        STAD 92
        LDAD 32
        STAD 93
        LDAD 100
        STAD 94
        LDAD 101
        STAD 95
        LDAD 102
        STAD 96
        LDAD 97
        STAD 97
        LDAD 117
        STAD 98
        LDAD 108
        STAD 99
        LDAD 116
        STAD 100
        LDAD 32
        STAD 101
        LDAD 100
        STAD 102
        LDAD 114
        STAD 103
        LDAD 105
        STAD 104
        LDAD 118
        STAD 105
        LDAD 101
        STAD 106
        LDAD 32
        STAD 107
        LDAD 115
        STAD 108
        LDAD 105
        STAD 109
        LDAD 110
        STAD 110
        LDAD 99
        STAD 111
        LDAD 101
        STAD 112
        LDAD 32
        STAD 113
        LDAD 116
        STAD 114
        LDAD 104
        STAD 115
        LDAD 101
        STAD 116
        LDAD 114
        STAD 117
        LDAD 101
        STAD 118
        LDAD 32
        STAD 119
        LDAD 97
        STAD 120
        LDAD 114
        STAD 121
        LDAD 101
        STAD 122
        LDAD 32
        STAD 123
        LDAD 110
        STAD 124
        LDAD 111
        STAD 125
        LDAD 32
        STAD 126
        LDAD 100
        STAD 127
        LDAD 114
        STAD 128
        LDAD 105
        STAD 129
        LDAD 118
        STAD 130
        LDAD 101
        STAD 131
        LDAD 115
        STAD 132
        LDAD 32
        STAD 133
        LDAD 121
        STAD 134
        LDAD 101
        STAD 135
        LDAD 116
        STAD 136
        LDAD 41
        STAD 137
    };
  
  
  
  
    //JMP adam program in the DEFAULT drive because there is NO other drive Actually its techinically just memory loacations
    //BIOS boot stuff constants // why did I not add something or even a macro to do this.
  
          asm{LDAD 489
          STAD 1100} // help 
          asm{LDAD 408
          STAD 1101} // cat   
          asm{LDAD 342
          STAD 1102} // rd 
          asm{LDAD 347
          STAD 1103} // wd   
          asm{LDAD 429
          STAD 1104} // exp 
          asm{LDAD 485
          STAD 1105} // exec 
          asm{LDAD 700
          STAD 1106} // textin
          asm{LDAD 446
          STAD 1107} // mkf   
          asm{LDAD 351
          STAD 1108} // ls   



    //asm{CALL clear_vga};
     asm{HLT}
    *(400) = 0; //power off varible //while 0 will keep machine continuing in current state.
    *(401) = 0; // will store condition of IO port 15 which is the IO port which emualtes an interupt which will make an enter happen on the shell if 1
    *(402) = 327; //keyboard pointer location
    *(11998) = 14000; // it is the pointer to the current free file space location // set to 0 for demonstration purposes
    
    

    asm{JMP Adam_d1};
    asm{HLT};
    asm{LABEL Adam_d1};
     asm{CALL clear_vga_lower};
        while(*(400) == 0){
            asm{CALL shell_scr
                CALL port_toPar};
                  
                  
         if(*(715) == 0){
            *(402) = *(402)+1; //type keyboard reed
            *(*(402)) = *(700);
           }

            *(2000) = 0;
            *(2001) = 0;
              while(*(2000) < 6){
                    *(2001) = *(2001)+ *(*(2000)+328);
                    *(2000) = *(2000) + 1;
              }

              
             if(*(715) != 0){
                     if(*(2001) == 489){ // help function. does nothing
                          asm{
                               LDAD 90
                               STAD 90
                          }
                                asm{JMP else1};
                     }
                     if(*(2001) == 414){ //mkf // make file
                               asm{CALL make_file};
                               asm{JMP else1};
                          }
                     if(*(2001) == 351){//ls //list files
                             asm{CALL file_list};
                                           asm{JMP else1};
                      }
                              if(*(2001) == 347 ){ //wd // writes data in the form of text.
                                   *(2005) = *(701);
                                    asm{CALL edit_text_file};
                                    asm{JMP else1};
                              }
                              if(*(2001) == 408){//cat //reads file as ascii to the VGA
                                    *(2005) = *(701);
                                    asm{CALL cat};
                                    asm{JMP else1};
                              }
                      if(*(2001) == 485){ // exec //boots the file into memory locatio 19000 and then executes the code with a ret function
                            *(2005) = *(701);
                            asm{CALL exec};
                            asm{JMP else1}
                      }
                     asm{CALL err};
                     asm{LABEL else1};
                     *(402) = 327;
                     asm{CALL clear_vga_lower};
                     //*(715) =0;//resets the 15th addr
                }

        }
 
    asm{HLT 0}
    asm{
    LABEL port_toPar
        HLT
        OUTP 0
        STAD 700
        OUTP 1
        STAD 701
        OUTP 2
        STAD 702
        OUTP 3
        STAD 703
        OUTP 4
        STAD 704
        OUTP 5
        STAD 705
        OUTP 6
        STAD 706
        OUTP 7
        STAD 707
        OUTP 8
        STAD 708
        OUTP 9
        STAD 709
        OUTP 10
        STAD 710
        OUTP 11
        STAD 711
        OUTP 12
        STAD 712
        OUTP 13
        STAD 713
        OUTP 14
        STAD 714
        OUTP 15
        STAD 715       
        RET 0
};



   asm{LABEL err};
                         *(0) = 69;
                         *(1) = 114;
                         *(2) = 114;
                         *(3) = 111;
                         *(4) = 114;
  
   asm{RET 0};
    asm{LABEL shell_scr
        LDAD 83
        STAD 320
        LDAD 72
        STAD 321
        LDAD 69
        STAD 322
        LDAD 76
        STAD 323
        LDAD 76
        STAD 324
        LDAD 92
        STAD 325
        LDAD 58
        STAD 326
        LDAD 62
        STAD 327
        RET 0};//heehaw
            //Hee haw indeed
    asm{LABEL clear_vga}
        *(0) = 0;
        while(*(0) < 352){
            *(0) = *(0) +1;
            *(*(0)) = 32;
        }
        *(0) = 32;
    asm{RET 0};
   asm{LABEL make_file}
      //struct fh{  char name[5]; int type;} //type 1 text, type 0 executable
        //6 word for name // 1 word for the type // 24 words for content // 4 words for the null terminations
       //*(11999) is the file pointer which can be used to edit the innards of a file
       asm{CALL clear_vga_lower};
       *(12000) = *(12000) + 1;
       *(*(12000)+12000) = *(11998);
       *(11990)  = *(11998); //FP set at current alloc pointer location  // will be set to 0 for demonstration purposes
       *(11998) = *(11998) + 35;//push the pointer up was it brk() or mmap()? Reminder (I don't remeber) (heap pointer type thinga majiggy)
      
       *(402) = 327;

          while(*(402) < 332){             
                asm{CALL print_name
                CALL port_toPar};
                    *(402) = *(402)+1; //type keyboard reed
                    *(*(402)) = *(700);
                    *(*(11990)) =*(700);
                    *(11990) = *(11990) +1;
         }
           *(*(11990)) =0; //null terminate file name
             
                  asm{LDAD 90
                STAD 325};
               asm{CALL port_toPar};
               *(11990) = *(11990)+1; // needs to push the file type ater the file name gets from port 1
           *(*(11990)) = *(700);
             
             
           *(11990) = *(11990) +1;
           *(*(11990))=*(715);
             
           *(11990) = *(11990) + 24;//null terminate actual file
           *(*(11990)) = 0;
           *(11990) = *(11990) +1;
                *(*(11990)) =0;
           *(11990) = *(11990) +1;
                *(*(11990)) =0;
           *(11990) = *(11990) +1;
               *(*(11990)) =0;
           *(11990) = *(11990) +1;
               asm{RET 0};
  
   asm{LABEL print_name};
          *(320) = 78;
          *(321) = 97;
          *(322) = 109;
          *(323) = 101;
          *(324) = 58;
     asm{RET 0};
     
    asm{LABEL file_list};
      //K-ON!
          *(2015) =0;
            *(2005) = 0;
           
            while(*(2015)<*(12000)){
                  *(2015) = *(2015)+1;
                  *(2004 )= *(*(2015) +12000);
                  asm{CALL print_file_name};
                  *(2004) = *(2004) + 1;
                  *(*(2005)) =32;
                  if(*(*(2004))  == 0){
                        asm{CALL print_exe}
                  }
                  if(*(*(2004))  != 0 ){
                        asm{CALL print_txt};
                  }
                  *(2005) = *(2005) + 22;
            }
   asm{RET 0}
  
   asm{LABEL print_txt};
            *(*(2005)+1) = 84;
            *(*(2005)+2) = 88;
            *(*(2005)+3) = 84;
         *(2005) = *(2005) +4;           
   asm{RET 0};
  
   asm{LABEL print_exe}
            *(*(2005)+1)  = 69;
            *(*(2005)+2)  = 88;
            *(*(2005)+3)  = 69; 
            *(2005) = *(2005) +4;
  asm{RET 0};
   asm{LABEL print_file_name};
              //*(2005) offset
          //*(2004) pointer to file name
          while(*(*(2004)) != 0){
               *(*(2005)) = *(*(2004));
               *(2004) = *(2004) + 1;
               *(2005) = *(2005) + 1;
          }
   asm{RET 0};
  

  
   asm{LABEL edit_text_file}; // can also be used to edit executables too IDK why I named it this.
        //*(2005) pointer to a pointer to a file header 
            *(11990) = *(12000 + *(2005)); // set to 0 for examples
            *(11990) = *(11990) + 7; // escape file header
            *(402) =32;
            *(700) = 65; //mikes sare zhat itsa noot zero so operations don't end
            while(*(700) != 0){           
           asm{CALL clear_vga_lower
             CALL port_toPar};
                    *(*(402)) = *(700);
                    *(*(11990)) =*(700);
                    *(11990) = *(11990) +1;
                              *(402) = *(402)+1; //type keyboard reed
                              if(46<*(402)){
                                    //need to add breaks if theres to much
                                    asm{JMP else2};
                              }
            }
   asm{LABEL else2};         
   asm{RET 0};   
   asm{LABEL cat};
        //*(2005) pointer to a pointer to a file header
           
            *(11990) = *(12000 + *(2005)); // set to 0 for examples
            *(11990) = *(11990) + 7; // escape file header
           *(402) = 0; //for looging through VGA
           *(30000) = 0;
             while(*(*(11990)) !=0){
                   *(*(402)) = *(*(11990));
                   *(402)= *(402)+1;
                   *(11990) = *(11990) +1;
             }
   asm{RET 0};
   asm{LABEL exec};
           *(11990) = *(12000 + *(2005)); // set to 0 for examples
           *(11990) = *(11990) + 7; // escape file header
           *(402) = 9000; //for looging through execution ram location
             while(*(*(11990)) !=0){
                   *(*(402)) = *(*(11990));
                   *(402)= *(402)+1;
                   *(11990) = *(11990) +1;
             }
             *(*(402)+1) = 419430400;
             asm{CALL 9000};
   asm{RET 0};
   
   asm{LABEL poke};
    //most op command found on the C64 and VIC systems.
   
   
   asm{RET 0};
   
    asm{LABEL clear_vga_lower}
        *(320) = 321;
        while(*(320) < 352){
            *(320) = *(320) +1;
            *(*(320)) = 32;
        }
        *(320) = 32;
    asm{RET 0}; 
}
