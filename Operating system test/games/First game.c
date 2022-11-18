int loc = 0;
int i = 0;// level store
int kbi =0;
char goal = "0";
char atoi_buffer = "16777216";
char atoi_buffer_b = "256";
int buffer =0;
char win_scr = "You win the game.";
char lose_scr = "You lose the game you failure. Your name is probably Jerry too. Now I come for your family.";
char tie_scr = "You tied";
char enem = "=";
char Not_ided_anything = "*";
char player = "@";

int teleport_cycle = 900;

int px =0;
int py =2;
int goalx =0;
int goaly =0;
int playerpt =0;
int botpt = 0;
//1000 - 1020 will be inventory memory locations

int main(){
      i=1;
        while(1==1){
                  clear();
            kprintt(0,atoi_b(i));
                  kprintt(4,$player);
                  kprintt(5,atoi_b(playerpt));
                  kprintt(9,$enem);
                  kprintt(10,atoi_b(botpt));
            mapcls();
                 
            mapgen(i);
           *(8000) = 0;
               *(8001) = 2;
           
            while(1==1){
                        *(*(8000)+((*(8001))* 32)) = enem;
                        player_disp();
                mapdisp();
                        *(*(8000)+((*(8001))* 32)) = enem;
                        player_disp();
                player_move_grb();
                        if(*(8000)<goalx){
                              *(8000) = *(8000) + 1;
                        }

                        if(*(8001)<goaly){
                              *(8001) = *(8001) + 1;
                        }
                        if(*(8000)>goalx){
                              *(8000) = *(8000) - 1;
                        }

                        if(*(8001)>goaly){
                              *(8001) = *(8001) -1;
                        }
                       
               
                        if(*(px+((py-2)*32)+353) == Not_ided_anything){
                            py=0;
                            while(*(px+((py-2)*32)+353) != Not_ided_anything){
                                teleport_cycle = xorshift(teleport_cycle);
                                px = teleport_cycle%31;
                                py = teleport_cycle%9+2;
                            }
                        }
               
                        if(*(*(8000)+((*(8001))* 32)) == Not_ided_anything){
                            *(8001)=0;
                            while(*(*(8000)+((*(8001))* 32)) != Not_ided_anything){
                                teleport_cycle = xorshift(teleport_cycle);
                                *(8000) = teleport_cycle%31;
                                *(8001) = teleport_cycle%9+2;
                            }
                        }      
               
               
                        if(*(*(8000)+((*(8001))* 32)) == goal){
                              botpt = botpt +1;
                              asm{JMP goal_found};
                             
                        }
                       
                               
               
               
                        if(*(px+((py-2)*32)+353) == goal){
                             
                              playerpt= playerpt+1;
                              asm{JMP goal_found};
                             
                        }
                       
            }
                 
                  asm{LABEL goal_found};
                 
            i= i+1;
           
            if(i == 100){
                asm{JMP win};
            }
        }
   
    asm{LABEL win}
    clear();
     
      if(botpt<playerpt){
            kprintt(0,$win_scr);
      }
      if(botpt>playerpt){
            kprintt(0,$lose_scr);
      }
    if(botpt==playerpt){
            kprintt(0,$tie_scr);
      }
}



int mapcls(){
    asm{ADJM 4};
        bpa[0] = 1;
        while(bpa[0] < 352){
            *((bpa[0])+352) =  32;
            bpa[0] = bpa[0] +1;
        }
    asm{ADJP 4};
}

int mapgen(){
    asm{ADJM 4};
        bpa[0] =0; //iterator
        bpa[1] = arg[0];//seed
        while(bpa[0] < 30){
            bpa[1] = xorshift(bpa[1]);
            *((bpa[1]%288)+353) = Not_ided_anything;
            bpa[0] = bpa[0] +1;
        }
   
    bpa[1] = xorshift(bpa[1]);
    *((bpa[1]%13)+((bpa[1]%9)*32)+353) =goal;
      goalx =(bpa[1]%13);
      goaly = (bpa[1]%9)+2;
    asm{ADJP 4};
}

int mapdisp(){
    asm{ADJM 4};
        bpa[0] = 0;
        while(bpa[0] < 288){
            *(bpa[0] + 64) = *(bpa[0]+353);
            bpa[0] = bpa[0] +1;
        }
    asm{ADJP 4};
}



int xorshift(){
        asm{ADJM 10};
                         bpa[1] = arg[0];
                         bpa[1] = bpa[1] ^ (bpa[1] << 13);
                         bpa[1] = bpa[1] ^ (bpa[1] >> 17);
                         bpa[1] = bpa[1] ^ (bpa[1] << 5);
                         bpa[1] = bpa[1] & 65535;
                         return bpa[1];
        asm{ADJP 10};
}


int kprintt(){//kernel print top
        asm{ADJM 4};
                        bpa[0] =0;
                        bpa[1] = 0;
                        while(*(bpa[0] + arg[0]) != 0){
                                *((bpa[0]+ arg[1])+ bpa[1] * 32) = *(bpa[0] + arg[0]);
                                bpa[0] = bpa[0] + 1;
                        }
                   loc = loc +1;
        asm{ADJP 4};
}


int atoi_b(){
        asm{ADJM 4};
                buffer = arg[0];
                bpa[0]=0;
                while(bpa[0] < 3){
                  *($atoi_buffer_b + 2 - bpa[0]) = buffer % 10;
                  *($atoi_buffer_b + 2 - bpa[0]) = 48 + *($atoi_buffer_b + 2 - bpa[0]);
                   buffer = buffer / 10;
                  bpa[0] = bpa[0] + 1;
                }
        asm{ADJP 4};
return $atoi_buffer_b;
}


int atoi(){//literally atoi
        asm{ADJM 4};
                buffer = arg[0];
                bpa[0]=0;
                while(bpa[0] < 8){
                  *($atoi_buffer + 7 - bpa[0]) = buffer % 10;
                  *($atoi_buffer + 7 - bpa[0]) = 48 + *($atoi_buffer + 7 - bpa[0]);
                        buffer = buffer / 10;
                  bpa[0] = bpa[0] + 1;
                }
        asm{ADJP 4};
return $atoi_buffer;
}

int clear(){
    asm{ADJM 2};
        bpa[0]=0;
        while(bpa[0] < 352){
             *(bpa[0]) = 32 ;
             bpa[0] = bpa[0] + 1;
        }
    asm{ADJP 2};
}



int player_move_grb(){
      asm{HLT 0
      OUTP 0
      STAD kbi};
        if(kbi == 119){
            py = py -1;
             
        }
        if(kbi == 97){
            px = px -1;
        }
       
        if(kbi == 115){
            py = py +1;
        }
        if(kbi == 100){
            px = px +1;
        }
}

int player_disp(){
    asm{ADJM 12};
           
            *(px+((py)*32)) = player;
    asm{ADJP 12};
}
