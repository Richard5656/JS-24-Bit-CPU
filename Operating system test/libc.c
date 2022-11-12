int i = 0;
int buffer = 0;
int loc =0;
int ie = 0; // looper for the decdmp
int k =0;


int kbi =0;//keyboard input 
int offset = 0;

int inf_loop_cond = 0;


char welcome = "Hello my name is Jerry";
char atoi_buffer = "16777216";
char atoi_buffer_b = "256 ";







int main(){
	clear();

}



int decdmp(){
	inf_loop_cond = 1;
    while(inf_loop_cond == 1){
		ie = 0;
		while(ie < 11){
			kprintma(offset+ie+20000);
			ie = ie + 1;
		}
		
		
		asm{HLT 0
            OUTP 0
            STAD kbi
		};
		
		if(kbi == 119){
			
			offset = offset - 1;
			
		}
		
		if(kbi == 115){
			
			offset = offset + 1;
			
		}
		
		if(kbi == 113){
			
			inf_loop_cond = 0;
			
		}
	}
}



int clear(){
    i=0;
    while(i < 352){
         *i = 32 ;
         i = i + 1;
    }
}

int atoi_b(){
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


int atoi(){//literally atoi
    buffer = arg[0];
    i=0;
    while(i < 8){
      *($atoi_buffer + 7 - i) = buffer % 10;
      *($atoi_buffer + 7 - i) = 48 + *($atoi_buffer + 7 - i);
        buffer = buffer / 10;
      i = i + 1;
    }
return $atoi_buffer;
}



int kprintma(){//dumps hex at certain position
    k =0;
	loc = loc % 11;
	buffer = atoi(arg[0]);
    while(*(k + buffer) != 0){
        *(k+ loc * 32) = *(k + buffer);
        k = k + 1;
   }
   
   k=0;
   buffer = *(arg[0]) >> 24;
   buffer = atoi_b(buffer);
   while(*(k + buffer) != 0){
        *(k+ 9+ loc * 32) = *(k + buffer);
        k = k + 1;
   }
   buffer = *(arg[0]) & 65280;
   buffer = atoi_b(buffer);
   k= 0;

   while(*(k + buffer) != 0){
        *(k+ 13+ loc * 32) = *(k + buffer);
        k = k + 1;
   }
   
   buffer = *(arg[0]) & 255;
   buffer = atoi_b(buffer);
   k= 0;
   while(*(k + buffer) != 0){
        *(k+ 17+ loc * 32) = *(k + buffer);
        k = k + 1;
   }
   
   
   loc = loc +1;
}


int kprintm(){//kernel print
    k =0;
	loc = loc % 11;
	buffer = atoi(arg[0]);
    while(*(k + buffer) != 0){
        *(k+ loc * 32) = *(k + buffer);
        k = k + 1;
   }
   
   k=0;
   buffer = atoi(arg[1]);
   while(*(k + buffer) != 0){
        *(k+ 9+ loc * 32) = *(k + buffer);
        k = k + 1;
   }
   loc = loc +1;
}


int kprint(){//kernel print
    i =0;
	loc = loc % 11;
    while(*(i + arg[0]) != 0){
        *(i+ loc * 32) = *(i + arg[0]);
        i = i + 1;
   }
   loc = loc +1;
}


