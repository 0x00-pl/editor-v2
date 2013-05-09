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
	});
	root.ref('data').ref('buffers').push('hello',tr);
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
	}));
	root.ref('data').push('buffer-cur',new file_system.file_bloc("hello"));
	event.register('user_keydown', root.ref('data').ref('buffers').ref('.user_keydown').data);
   
	buffers.red_hello_buffer();
    },
};
buffers.start_up();
