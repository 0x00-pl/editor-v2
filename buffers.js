var buffers={
    red_hello_buffer:function(){
	var tr= new file_system.file_dir({
	    '.render_to_html':new file_system.file_bloc(function(_tr){
		var txt=_tr.get('text').data;
		return "<a class='red'>"+escapeHtml(txt)+"</a>";
	    }),
	    'text':new file_system.file_bloc('hello world!'),
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
	}));
	root.ref('data').push('buffer-cur',new file_system.file_bloc("hello"));

	buffers.red_hello_buffer();
    },
};
buffers.start_up();
