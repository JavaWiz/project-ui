$(function(){

    //ajax row data
    var ajax_data =
    [
        {product:"DL380", desc:"DL380", option:"BTO", subitem: true, quantity: 10}, 
        {product:"DL380 xyz", desc:"DL380 xyz", option:"BTO", subitem: true, quantity: 2},
        {product:"DL380 abc", desc:"DL380 abc", option:"BTO", subitem: true, quantity: 4},
    ];

    var random_id = function(){
        var id_num = Math.random().toString(9).substr(2,3);
        var id_str = Math.random().toString(36).substr(2);
        return id_num + id_str;
    }

    var ad_hoc_container = `<div class="ad-hoc-container">
                            <h2>Ad-Hoc</h2>
                            <input
                                data-mdb-search=""
                                data-mdb-target="#table_modal"
                                type="text"
                                id="search_modal"
                                class="form-control"/>
                            <label class="form-label" for="search_modal" style="margin-left: 0px">Search</label>
                            <button
                                class="btn add-button ripple-surface"
                                data-mdb-add-entry=""
                                data-mdb-target="#table_inputs">
                                <i class="fa fa-plus"></i>
                            </button>`;

    var table ='';
    table+=`<table class="ad-hoc-table">
                    <thead>
                    <tr>
                        <th>Product</th>
                        <th>Description</th>
                        <th>Option</th>
                        <th>Sub-item</th>
                        <th>Quantity</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>`;
    $.each(ajax_data, function(index, val){
        var row_id = random_id();
        table+='<tr class="ad-hoc-row">'+
                    '<td><div class="row_data" edit_type="click" col_name="product">'+val['product']+'</div></td>'+
                    '<td><div class="row_data" edit_type="click" col_name="desc">'+val['desc']+'</div></td>'+
                    '<td><div class="row_data" edit_type="click" col_name="option">'+val['option']+'</td>'+
                    '<td><div class="row_data" edit_type="click" col_name="subitem">'+val['subitem']+'</td>'+
                    '<td><div class="row_data" edit_type="click" col_name="quantity">'+val['quantity']+'</td>'+
                    '<td>'+
                        '<span class="btn_edit" > <a href="#" class="btn btn-link " row_id="'+row_id+'" > Edit</a> </span>'+
                        //only show this button if edit button is clicked
                        '<span class="btn_save"> <a href="#" class="btn btn-link"  row_id="'+row_id+'"> Save</a> | </span>'+
                        '<span class="btn_cancel"> <a href="#" class="btn btn-link" row_id="'+row_id+'"> Cancel</a> | </span>'+
                    '</td>'+
                '</tr>';
        
    });
    table +=`</tbody></table>`;
    
    ad_hoc_container += table + '</div>';
    $(document).find('.ad-hoc-container').append(ad_hoc_container);
    $(document).find('.btn_save').hide();
    $(document).find('.btn_cancel').hide();


    //--->make div editable > start
    $(document).on('click', '.row_data', function(event) 
    {
        event.preventDefault(); 

        if($(this).attr('edit_type') == 'button')
        {
            return false; 
        }

        //make div editable
        $(this).closest('div').attr('contenteditable', 'true');
        //add bg css
        $(this).addClass('bg-warning').css('padding','5px');

        $(this).focus();
    })	
    //--->make div editable > end

    //--->button > edit > start	
    $(document).on('click', '.btn_edit', function(event){
        event.preventDefault();
        var tbl_row = $(this).closest('tr');

        var row_id = tbl_row.attr('row_id');

        tbl_row.find('.btn_save').show();
        tbl_row.find('.btn_cancel').show();

        //hide edit button
        tbl_row.find('.btn_edit').hide(); 

        //make the whole row editable
        tbl_row.find('.row_data')
        .attr('contenteditable', 'true')
        .attr('edit_type', 'button')
        .addClass('bg-warning')
        .css('padding','3px')

        //--->add the original entry > start
        tbl_row.find('.row_data').each(function(index, val){  
            //this will help in case user decided to click on cancel button
            $(this).attr('original_entry', $(this).html());
        }); 		
        //--->add the original entry > end
    });
    //--->button > edit > end

    //--->button > cancel > start	
    $(document).on('click', '.btn_cancel', function(event){
        event.preventDefault();

        var tbl_row = $(this).closest('tr');

        var row_id = tbl_row.attr('row_id');

        //hide save and cacel buttons
        tbl_row.find('.btn_save').hide();
        tbl_row.find('.btn_cancel').hide();

        //show edit button
        tbl_row.find('.btn_edit').show();

        //make the whole row editable
        tbl_row.find('.row_data')
        .attr('edit_type', 'click')
        .removeClass('bg-warning')
        .css('padding','') 

        tbl_row.find('.row_data').each(function(index, val) 
        {   
            $(this).html( $(this).attr('original_entry') ); 
        });  
    });
    //--->button > cancel > end

    //--->save whole row entery > start	
    $(document).on('click', '.btn_save', function(event){
        event.preventDefault();
        var tbl_row = $(this).closest('tr');

        var row_id = tbl_row.attr('row_id');

        //hide save and cacel buttons
        tbl_row.find('.btn_save').hide();
        tbl_row.find('.btn_cancel').hide();

        //show edit button
        tbl_row.find('.btn_edit').show();


        //make the whole row editable
        tbl_row.find('.row_data')
        .attr('edit_type', 'click')
        .removeClass('bg-warning')
        .css('padding','') 

        //--->get row data > start
        var arr = {}; 
        tbl_row.find('.row_data').each(function(index, val) 
        {   
            var col_name = $(this).attr('col_name');  
            var col_val  =  $(this).html();
            arr[col_name] = col_val;
        });
        //--->get row data > end

        //use the "arr"	object for your ajax call
        $.extend(arr, {row_id:row_id});

        //out put to show
        $('.post_msg').html( '<pre class="bg-success">'+JSON.stringify(arr, null, 2) +'</pre>')
    });
    //--->save whole row entery > end


    //--->save single field data > start
    $(document).on('focusout', '.row_data', function(event){
        event.preventDefault();

        if($(this).attr('edit_type') == 'button'){
            return false; 
        }

        var row_id = $(this).closest('tr').attr('row_id'); 
        
        var row_div = $(this)				
        .removeClass('bg-warning') //add bg css
        .css('padding','')

        var col_name = row_div.attr('col_name'); 
        var col_val = row_div.html(); 

        var arr = {};
        arr[col_name] = col_val;

        //use the "arr"	object for your ajax call
        $.extend(arr, {row_id:row_id});

        //out put to show
        $('.post_msg').html( '<pre class="bg-success">'+JSON.stringify(arr, null, 2) +'</pre>');
    })	
    //--->save single field data > end

    //add row to the table
    $(".add-button").click(function () {
        $(".ad-hoc-table").each(function () {
            var tds = "<tr>";
            $.each($("tr:last td", this), function () {
            tds += "<td>" + $(this).html() + "</td>";
            });
            tds += "</tr>";
            if ($("tbody", this).length > 0) {
            $("tbody", this).append(tds);
            } else {
            $(this).append(tds);
            }
        });
    });

    // delete row operation
    $('tbody').on('click', '.delete-button', function () {
        var rowCount = $('.ad-hoc-table tbody tr').length;
        console.log(rowCount);
        var child = $(this).closest('tr').nextAll();
        if(rowCount>1)
            // Removing the current row. 
            $(this).closest('tr').remove();
    })
})