var buffers={
    red_hello_buffer:function(){
	var tr= new file_system.file_dir({
	    'text':new file_system.file_bloc('hello world!'),
	    'pos-cur':new file_system.file_bloc(0),
	    '.render_to_html':new file_system.file_bloc(function(_tr){
		var txt= _tr.get('text').data;
		var pos= _tr.get('pos-cur').data;
		return escapeHtml(txt.substring(0,pos))+"<a class='red'>|</a>"+escapeHtml(txt.substring(pos,txt.length));
	    }),
	    '.get_cursor':new file_system.file_bloc(function(_tr){
		//local-key-event
	    }),
	    '.user_keydown':new file_system.file_bloc(function(sender,key_event){
		var key= key_event.keyCode;
		//alert(show(key_event));
		if(key==key_event.DOM_VK_LEFT){
		    var pos= sender.ref('pos-cur');
		    pos.data= max(0,pos.data-1);
		}
		if(key==key_event.DOM_VK_RIGHT){
		    var pos= sender.ref('pos-cur');
		    pos.data= min(sender.ref('text').data.length,pos.data+1);
		}
	    }),
	    '.user_input':new file_system.file_bloc(function(sender,txt){
		var pos= sender.ref('pos-cur').data;
		var old_txt= sender.ref('text').data;
		sender.ref('text').data= old_txt.substring(0,pos)+txt+old_txt.substring(pos);
		sender.ref('pos-cur').data+= txt.length;
	    }),
	});
	return tr;
    },
    text_buffer:function(){
	var cursor= function(buf_dir){
	    this.state_insert=false;
	    this.pos=0;
	    this.move_left=function(){if(this.state_insert)return; this.pos=max(this.pos-1,0);};
	    this.move_right=function(){if(this.state_insert)return; this.pos=min(this.pos+1,buf_dir.ref('text').data.length);};
	    this.backspace=function(){
		if(this.state_insert)return;
		if(this.pos<=0)return;
		var old= buf_dir.ref('text').data;
		buf_dir.ref('text').data= old.substring(0,this.pos-1)+ old.substring(this.pos,old.length);
		this.pos= this.pos-1;
	    };
	    this.begin_insert=function(){
		if(this.state_insert)return;
		this.state_insert=true;
		document.getElementById("main_input").hidden=false;
		document.getElementById("main_input").focus();
		document.getElementById("main_input").value=' ';
	    };
	    this.end_insert=function(){
		if(this.state_insert==false)return;
		this.state_insert=false;
		document.getElementById("main_input").hidden=true;
	    };
	    this.insert=function(txt){
		if(this.state_insert==false)return;
		var old= buf_dir.ref('text').data;
		buf_dir.ref('text').data= old.substring(0,this.pos)+ txt+ old.substring(this.pos,old.length);
		this.pos= this.pos+txt.length;
		this.end_insert();
	    };
	};
	var tr= new file_system.file_dir();
	tr.push('text',new file_system.file_bloc("text--hello world! [press 'space' to insert]"));
	tr.push('cursor',new file_system.file_bloc(new cursor(tr)));
	tr.push('.render_to_html',new file_system.file_bloc(function(){
	    var txt= tr.ref('text').data;
	    var pos= tr.ref('cursor').data.pos;
	    return escapeHtml(txt.substring(0,pos))+"<a class='red'>|</a>"+escapeHtml(txt.substring(pos,txt.length));
	}));
	tr.push('.user_keydown',new file_system.file_bloc(function(sender,key_event){
	    var key= key_event.keyCode;//get VK code
	    //alert(show(tr.ref('cursor').data));
	    if(key==key_event.DOM_VK_LEFT || key==37){
		tr.ref('cursor').data.move_left();
	    }else
	    if(key==key_event.DOM_VK_RIGHT || key==39){
		tr.ref('cursor').data.move_right();
	    }else
	    if(key==key_event.DOM_VK_BACK_SPACE || key==8){
		tr.ref('cursor').data.backspace();
	    }else
	    if(key==key_event.DOM_VK_SPACE || key==32){
		tr.ref('cursor').data.begin_insert();
	    }
	}));
	tr.push('.user_input',new file_system.file_bloc(function(sender,txt){
	    tr.ref('cursor').data.insert(txt);
	}));
	return tr;
    },
    start_up:function(){
	root.ref('data').push('buffers',new file_system.file_dir({
	    '.render_to_html':new file_system.file_bloc(function(bfs){
		var cur= root.ref('data').ref('buffer-cur').data;
		return render_to_html.render(bfs.ref(cur));
	    }),
	    '.user_keydown':new file_system.file_bloc(function(bfs,key_event){
		var cur= root.ref('data').ref('buffer-cur').data;
		return bfs.ref(cur).ref('.user_keydown').data(bfs.ref(cur),key_event);
	    }),
	    '.user_input':new file_system.file_bloc(function(bfs,txt){
		var cur= root.ref('data').ref('buffer-cur').data;
		return bfs.ref(cur).ref('.user_input').data(bfs.ref(cur),txt);
	    }),
	}));
	root.ref('data').push('buffer-cur',new file_system.file_bloc("hello"));
	root.ref('data').push('.get_cursor',new file_system.file_bloc(function(sender,args){var TODO=0;}));
	event.register('user_keydown', root.ref('data').ref('buffers').ref('.user_keydown').data);
	event.register('user_input', root.ref('data').ref('buffers').ref('.user_input').data);
      
	root.ref('data').ref('buffers').push('hello',buffers.text_buffer());
    },
};
buffers.start_up();
