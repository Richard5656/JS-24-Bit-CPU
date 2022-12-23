//oporating system V2 tenshi
char atoi_buffer = "16777216";


char key_buffer[35];
int keycode = 0;
int extra_key = 0;//backspace and enter key
int key_buffer_index = 0;



char tick = ">";

int pb_ap = 0; //ammount of parameters
int terminal_pointer = 0; // memory location at which the terminal currently points at


int main(){
    clear();
    while(1==1){
        print(320+10,$key_buffer);
        print(320+8,$tick);
        print(320,atoi(terminal_pointer));
        kbi();
    }
}





int strlen(){
    int i =0;
    while(*(arg[0]+i) !=0){
        i = i +1;
    }
    return i;
}

int pb(){  //rempap param indexes
    //for aestetic
    return pb_ap-arg[0];
}

int memwrite(){
    pb_ap = 2;
    int dest = arg[pb(0)];
    int ammount = arg[pb(1)];
    int what_to_write = arg[pb(2)];
    int i =0;
    while(i<ammount){
        *(i+dest) = what_to_write;
        i=i+1;
    }
}


int print(){
    int i =0;
    while(*(arg[0]+i) !=0){
        *(i+arg[1]) = *(arg[0]+i);
        i = i +1;
    }
}

int clear(){
    memwrite(0,352,32);
}


int atoi(){//literally atoi

    int buffer = arg[0];
    buffer = arg[0];
   
    int i =0;
    while(i < 8){
      *($atoi_buffer + 7 - i) = buffer % 10;
      *($atoi_buffer + 7 - i) = *($atoi_buffer + 7 - i) ^ 48;
        buffer = buffer / 10;
      i = i + 1;
    }
return $atoi_buffer;
}


int atoi_b(){
    char atoi_buffer_b = "256 ";
     buffer = arg[0];
    i=0;
    while(i < 3){
      *($atoi_buffer_b + 2 - i) = buffer % 10;
      *($atoi_buffer_b + 2 - i) = 48 + *($atoi_buffer_b + 2 - i);
        buffer = buffer / 10;
      i = i + 1;
    }
return $atoi_buffer_b;
}



int kbi(){
    asm{
        HLT 0
        OUTP 0
        STAD keycode
        OUTP 15
        STAD extra_key
    };

       
   
    if(31<key_buffer_index){key_buffer_index =0;memwrite($key_buffer,35,0);}    
   
    if(extra_key == 2){//handles a backspace
        key_buffer_index = key_buffer_index-1;
        *($key_buffer + key_buffer_index) = 32;  
    }
    if(extra_key == 1){//handles a enter
        parse_command();
        key_buffer_index =0;
        memwrite($key_buffer,35,0);
    }
   
    if(extra_key == 0){
        *($key_buffer + key_buffer_index) = keycode;
        key_buffer_index = key_buffer_index+1;
    }
    return 0;
}


int strcmp(){
    int str1 = arg[0];
    int str2 = arg[1];
    int i =0;
    int the_same = 0; // 0 if it is the same
    while(*(i+str1)!=0){
        if(*(i+str1)  != *(i+str2)){
            the_same=1;
        }
        i= i+1;
    }
	print(0,atoi(the_same));
    return the_same;
}

int parse_command(){
    char inc = "INC";
	
    if(strcmp($key_buffer,$inc) == 0){
        terminal_pointer = terminal_pointer+1;
        asm{JMP good_end};
    }
	
    char err = "ERROR: Reason you're stupid";
    print(0,$err);

    asm{LABEL good_end};
	
   
}
int memcpy(){
	pg_ap = 2;
	int src = arg[pg(0)];
	int dest = arg[pg(1)];
	int ammount = arg[pg(2)];
	while(src < dest){
		*(src) = *(dest);
		src = src+1;
		dest = dest+1;
	}
}
