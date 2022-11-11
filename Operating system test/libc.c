int i = 0;
int buffer = 0;
int loc =0;
int ie = 0;
char welcome = "Hello my name is Jerry";
char atoi_buffer = "16777216";

int main(){
	clear();
	while(ie < 30){
		kprint(atoi(ie));
		ie = ie +1;
	}
}



int clear(){
    i=0;
    while(i < 352){
         *i = 32 ;
         i = i + 1;
    }
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



int kprint(){//kernel print
    i =0;
	loc = loc % 11;
    while(*(i + arg[0]) != 0){
        *(i+ loc * 32) = *(i + arg[0]);
        i = i + 1;
   }
   loc = loc +1;
}