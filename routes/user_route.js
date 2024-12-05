var express= require("express");
var router=express.Router();
var url = require("url");

var exe= require("./../connection")


router.get("/", async function(req,res){
    var data= await exe(`SELECT * FROM company`);
    var data2=await exe(`SELECT * FROM top_slider`)
    var data3=await exe(`SELECT * FROM home_our_service`);
    var data4=await exe(`SELECT * FROM home_about_info`);
    var data5=await exe(`SELECT * FROM home_facility`);
    var data6=await exe(`SELECT * FROM feature`);
    var data7=await exe(`SELECT * FROM heading`);
    var data8=await exe(`SELECT * FROM eligibility`);
    var data9=await exe(`SELECT * FROM document`);
    var data10=await exe(`SELECT * FROM video`);
    var data11=await exe(`SELECT * FROM footer`);
    var data12=await exe(`SELECT * FROM bank_partner`);

    var data51 = await exe(`SELECT * FROM loan_details`);


    var obj={"company_info":data[0],"slider":data2,"home_service_img":data3,"a_info":data4,"facilities":data5,
            "features":data6,"heading":data7,"eligibilities":data8,"documents":data9,"videos":data10,
            "bank_partner":data12,
            "footer_info":data11[0],

            "loan_scheme":data51
    };
    res.render("user/index.ejs", obj);
});

router.post("/send_enquiry",async function(req,res){
    var d=req.body;
    var sql= `INSERT INTO enquiry ( enquiry_type, name_of_enquired, email_of_enquired, mobile_of_enquired,
                              currentdate, currenttime) VALUES 
                     ('${d.enquiry_type}','${d.name_of_enquired}','${d.email_of_enquired}',
                    '${d.mobile_of_enquired}', '${d.currentdate}','${d.currenttime}')`;

    // var sql=`CREATE TABLE enquiry(enquiry_id INT PRIMARY KEY AUTO_INCREMENT, enquiry_type VARCHAR(100), name_of_enquired VARCHAR(100),
    //          email_of_enquired VARCHAR(1000), mobile_of_enquired VARCHAR(15), currentdate TEXT, currenttime TIME);`

    var data= await exe(sql);
    // res.send(data);
    res.redirect("/")
});

router.post("/customer_support_data",async function(req,res){
    var d=req.body;
    // var sql=`CREATE TABLE customer_support (customer_support_id INT PRIMARY KEY AUTO_INCREMENT,
    //             customer_name TEXT, customer_email TEXT, customer_mobile TEXT, customer_address TEXT, customer_query TEXT)`;
    var sql=`INSERT INTO customer_support(customer_name, customer_email, 
                customer_mobile, customer_address, customer_query)
                 VALUES ('${d.customer_name}','${d.customer_email}','${d.customer_mobile}',
                 '${d.customer_address}','${d.customer_query}')`;
    var data=await exe(sql);
    // res.send(data);
    res.redirect("/");
});

// Service Page Start
router.get("/services",async function(req,res){
    var data= await exe(`SELECT * FROM company`);
    var data11=await exe(`SELECT * FROM footer`);
    var data12=await exe(`SELECT * FROM service`);
    var data13= await exe(`SELECT * FROM service_page_info`);
    

    var data51 = await exe(`SELECT * FROM loan_details`);

    var obj={"company_info":data[0],"footer_info":data11[0],"services":data12,"s_info":data13[0],
        "loan_scheme":data51
    }
    res.render("user/services.ejs",obj);
});
router.post("/send_service_inquiry",async function(req,res){
    var d=req.body;
    var sql=`INSERT INTO service_enquiry ( name ,email ,  phone , information , service_title, currentdate,currenttime ) VALUES
                        ('${d.name}','${d.email}','${d.phone}','${d.information}','${d.service_title}',
                        '${d.currentdate}','${d.currenttime}' ) `;
    var data=await exe(sql)
    // res.send(data);
    res.redirect("/services")
});
// Notice Page Start

router.get("/notice",async function(req,res){
    var data= await exe(`SELECT * FROM company`);
    var data11=await exe(`SELECT * FROM footer`);
    var data14=await exe(`SELECT * FROM notice`);
    var data15= await exe(`SELECT * FROM notice_page_info`);

    var data51 = await exe(`SELECT * FROM loan_details`);    

    var obj={"company_info":data[0],"footer_info":data11[0],"notice":data14,"notice_info":data15[0],
        "loan_scheme":data51
    }
    res.render("user/notice.ejs",obj);
});

// About Pages Start

router.get("/about_janlakshmi",async function(req,res){
    var data= await exe(`SELECT * FROM company`);
    var data11=await exe(`SELECT * FROM footer`);    
    var data51 = await exe(`SELECT * FROM loan_details`);

    var data2=await exe(`SELECT * FROM about_page`);
    var data3=await exe(`SELECT * FROM about_branch`);
    var data4=await exe(`SELECT * FROM about_our_vision`);
    var data5=await exe(`SELECT * FROM about_our_history`);
    var data6=await exe(`SELECT * FROM about_our_mission`);
    var data7=await exe(`SELECT * FROM get_in_touch`);
    var data8=await exe(`SELECT * FROM customer_review`);

    var obj={"company_info":data[0],"footer_info":data11[0],
        "loan_scheme":data51,
        "about":data2[0],"branch":data3,"vision":data4[0],"history":data5[0],"mission":data6[0],
        "get_touch":data7[0],"review":data8
    }
    res.render("user/about_page.ejs",obj);
});

// Chairman page Start

router.get("/about_chairman",async function(req,res){
    var data= await exe(`SELECT * FROM company`);
    var data11=await exe(`SELECT * FROM footer`);
    
    var data51 = await exe(`SELECT * FROM loan_details`);    
    var data2=await exe(`SELECT * FROM chairman_slider`);
    var data3=await exe(`SELECT * FROM chairman_detail`);
    var data4=await exe (`SELECT * FROM chairman_gallery`);




    var obj={"company_info":data[0],"footer_info":data11[0],
        "loan_scheme":data51,"slider":data2,"chairman_info":data3[0],"gallery":data4
    }

    res.render("user/chairman.ejs",obj);
})


// Term Page Start
router.get("/tearm&condition",async function(req,res){
    var data= await exe(`SELECT * FROM company`);
    var data11=await exe(`SELECT * FROM footer`);
    var data12=await exe(`SELECT * FROM service`);
    
    

    var data51 = await exe(`SELECT * FROM loan_details`);

    var obj={"company_info":data[0],"footer_info":data11[0],"services":data12,
        "loan_scheme":data51
    }
    res.render("user/tearm&condition.ejs",obj);
});

// Privacy policy Page Start
router.get("/privacy_policy",async function(req,res){
    var data= await exe(`SELECT * FROM company`);
    var data11=await exe(`SELECT * FROM footer`);
    var data12=await exe(`SELECT * FROM service`);
    

    var data51 = await exe(`SELECT * FROM loan_details`);

    var obj={"company_info":data[0],"footer_info":data11[0],"services":data12,
        "loan_scheme":data51
    }
    res.render("user/privacy_policy.ejs",obj);
});













// Shreyas sir work
// Gallery Page Start

// router.get("/gallery",async function(req,res){
//     var data= await exe(`SELECT * FROM company`);
//     var data11=await exe(`SELECT * FROM footer`);
//     var data51 = await exe(`SELECT * FROM loan_details`);
//     // var data3 = await exe(`SELECT * FROM loan_details`);
//     var data4 = await exe(`SELECT * FROM gallery WHERE LENGTH(gallery_image_caption) > 0 AND LENGTH(gallery_image) > 0`);
//     var data5 = await exe(`SELECT * FROM gallery WHERE LENGTH(gallery_video_caption) > 0 AND LENGTH(gallery_video) > 0`);
//     var data6 = await exe(`SELECT gallery_bg_image FROM gallery_background_img`);


//     var obj={"company_info":data[0],"footer_info":data11[0],
//                     // "loan_details":data3,
//                  "gallery_image":data4,
//                   "gallery_video":data5,
//                  "gallery_bg":data6[0],"footer_info":data11[0],
//         "loan_scheme":data51}
//     res.render("user/gallery.ejs",obj);
// });


router.get("/gallery",async function(req,res){
    var urldata = url.parse(req.url,true).query;
    var total_images = (await exe(`SELECT COUNT(*) as ttl_images FROM gallery WHERE LENGTH(gallery_image_caption) > 0 AND LENGTH(gallery_image) > 0`))[0].ttl_images;
    var total_videos = (await exe(`SELECT COUNT(*) as ttl_videos FROM gallery WHERE LENGTH(gallery_video_caption) > 0 AND LENGTH(gallery_video) > 0`))[0].ttl_videos;
    var per_page_image = 6;
    var per_page_video = 2;
    var total_image_pages = total_images / per_page_image; 
    var total_video_pages = total_videos / per_page_video; 
    var total_pages = total_image_pages + total_video_pages
   
    if(urldata.page_no==undefined)
    {
        page_no = 1;
    }
    else
    {
        page_no = urldata.page_no;
    }
    var starting_index_of_limit_for_images = (per_page_image * page_no) - per_page_image;
    var starting_index_of_limit_for_videos = (per_page_video * page_no) - per_page_video;

    


    var data= await exe(`SELECT * FROM company`);
    var data11=await exe(`SELECT * FROM footer`);
    var data51 = await exe(`SELECT * FROM loan_details`);
    // var data3 = await exe(`SELECT * FROM loan_details`);
    var data4 = await exe(`SELECT * FROM gallery WHERE LENGTH(gallery_image_caption) > 0 AND LENGTH(gallery_image) > 0 LIMIT ${starting_index_of_limit_for_images}, ${per_page_image}`);
    var data5 = await exe(`SELECT * FROM gallery WHERE LENGTH(gallery_video_caption) > 0 AND LENGTH(gallery_video) > 0 LIMIT ${starting_index_of_limit_for_videos}, ${per_page_video}`);
    var data6 = await exe(`SELECT gallery_bg_image FROM gallery_background_img`);


    var obj={"company_info":data[0],"footer_info":data11[0],
        // "loan_details":data3,
            "gallery_image":data4,
            "gallery_video":data5,
            "gallery_bg":data6[0],"footer_info":data11[0],
            "loan_scheme":data51,
            "total_pages":total_pages,
            "page_no":page_no}
    res.render("user/gallery.ejs",obj);
});




// contact Us  Page Start

// Contact Us Section

router.get("/contact_us",async function(req,res)
{   var data= await exe(`SELECT * FROM company`);
    var data11=await exe(`SELECT * FROM footer`);
    var data51 = await exe(`SELECT * FROM loan_details`);
    // var data3 = await exe(`SELECT * FROM loan_details`);
    // var data4 = await exe(`SELECT * FROM gallery WHERE LENGTH(gallery_image_caption) > 0 AND LENGTH(gallery_image) > 0`);
    // var data5 = await exe(`SELECT * FROM gallery WHERE LENGTH(gallery_video_caption) > 0 AND LENGTH(gallery_video) > 0`);
    // var data6 = await exe(`SELECT gallery_bg_image FROM gallery_background_img`);


    var obj={"company_info":data[0],"footer_info":data11[0],
                    // "loan_details":data3,
                //  "gallery_image":data4,
                //   "gallery_video":data5,
                //  "gallery_bg":data6[0],
                 "footer_info":data11[0],
        "loan_scheme":data51}
    res.render("user/contact_us.ejs",obj);
});
router.post("/contact_enquiry",async function(req,res)
{
    var d = req.body;
    var sql = `INSERT INTO contact_enquiry(contact_enq_name,
                                            contact_enq_email,
                                            contact_enq_mobile,
                                            contact_enq_subject,
                                            contact_enq_message) VALUES
                                            ('${d.contact_enq_name}',
                                            '${d.contact_enq_email}',
                                            '${d.contact_enq_mobile}',
                                            '${d.contact_enq_subject}',
                                            '${d.contact_enq_message}')`;
    var data = await exe(sql);
    // res.send(data)
    res.redirect("/contact_us");
});


// Types Of Loan Page

// router.get("/loan_page",async function(req,res)
// {
//     var data= await exe(`SELECT * FROM company`);
//     var data2=await exe(`SELECT * FROM top_slider`)
//     var data3=await exe(`SELECT * FROM home_our_service`);
//     var data4 = await exe(`SELECT * FROM loan_details`);
//     var data= await exe(`SELECT * FROM company`);
//     var data11=await exe(`SELECT * FROM footer`);
//     var obj={"company_info":data[0],
//             "slider":data2,
//             "home_service_img":data3,
//             "loan_details":data4,
//             "footer_info":data11
//         };
//     res.render("user/loan_page.ejs", obj)
// });
router.get("/loan_page",async function(req,res){
    var data= await exe(`SELECT * FROM company`);
    var data11=await exe(`SELECT * FROM footer`);
    var data51 = await exe(`SELECT * FROM loan_details`);
    var data3 = await exe(`SELECT * FROM loan_details`);
    var data51 = await exe(`SELECT * FROM loan_details`);


    var obj={"company_info":data[0],"footer_info":data11[0],"loan_scheme":data51,
        "loan_details":data3,
        "footer_info":data11[0]
        }
    res.render("user/loan_page.ejs",obj)
 
});

// Loan Type Page Details

router.get("/loan_details/:loan_type_id",async function(req,res)
{
    var id = req.params.loan_type_id;
    var data = await exe(`SELECT * FROM company`);
    var data2 = await exe(`SELECT * FROM loan_details `);
    var data4 = await exe(`SELECT * FROM loan_details WHERE loan_type_id = '${id}'`);
    var data5 = await exe(`SELECT * From loan_docs_apps WHERE loan_type_id = '${id}'  AND LENGTH(loan_documents) > 0`);
    var data6 = await exe(`SELECT * From loan_docs_apps WHERE loan_type_id = '${id}'  AND LENGTH(loan_application) > 0`);
    var data11=await exe(`SELECT * FROM footer`);
    

    


    var obj={"company_info":data[0],
        "loan_scheme":data2,
        "loan_details":data4[0],
        "loan_docs1":data5,
        "loan_docs2":data6,"footer_info":data11[0]
    };
    res.render("user/loan_details.ejs", obj)
});


// Loan Page Enquiry Form

router.post("/loan_enquiry",async function(req,res)
{
    var d = req.body;
    var sql = `INSERT INTO loan_enquiry (
                                        loan_type_id,
                                        loan_name,
                                        enquirers_name,
                                        enquirers_email,
                                        enquirers_mobile,
                                        enquirers_city,
                                        enquirers_message) VALUES(
                                        '${d.loan_type_id}',
                                        '${d.loan_name}',
                                        '${d.enquirers_name}',
                                        '${d.enquirers_email}',
                                        '${d.enquirers_mobile}',
                                        '${d.enquirers_city}',
                                        '${d.enquirers_message}'
                                        )`;
    var data = await exe(sql) 
    // res.send(data)
    res.redirect("/loan_page");
});



// team Page Start
router.get("/team",async function(req,res)
{
    var data= await exe(`SELECT * FROM company`);
    var data11=await exe(`SELECT * FROM footer`);
    var data3 = await exe(`SELECT * FROM loan_details`);
    var data51 = await exe(`SELECT * FROM loan_details`);
    var data_manager = await exe(`SELECT * FROM team_manager_details`);
    var data_members = await exe(`SELECT * FROM team_member_details`);

    var obj={"company_info":data[0],
        "footer_info":data11[0],
        "loan_scheme":data51,
        "loan_details":data3,
        "manager_details":data_manager[0],
        "team_members":data_members}
    res.render("user/team.ejs",obj)
});

// deposite pages start

router.get("/deposit_scheme_page",async function(req,res)
{
    var data= await exe(`SELECT * FROM company`);
    var data11=await exe(`SELECT * FROM footer`);
    var data3 = await exe(`SELECT * FROM loan_details`);
    var data51 = await exe(`SELECT * FROM loan_details`);
    var data_slide = await exe(`SELECT * FROM deposit_scheme_slide`)
    var data_card = await exe(`SELECT * FROM deposit_scheme_card`)
    var data_info_card = await exe(`SELECT * FROM deposit_info_card`)
    var data_info_card_docs1 = await exe(`SELECT * FROM info_card_docs WHERE info_card_id = 2`)
    var data_info_card_docs2 = await exe(`SELECT * FROM info_card_docs WHERE info_card_id = 3`)
    var data_info_card_docs3 = await exe(`SELECT * FROM info_card_docs WHERE info_card_id = 4`)
    var data_info_card_docs4 = await exe(`SELECT * FROM info_card_docs WHERE info_card_id = 5`)




    var obj={"company_info":data[0],
        "footer_info":data11[0],
        "loan_scheme":data51,
        "loan_details":data3,
        "footer_info":data11[0],
        "deposit_slides":data_slide,
        "deposit_cards":data_card,
        "deposit_info_cards":data_info_card,
        "info_card_docs1": data_info_card_docs1,
        "info_card_docs2": data_info_card_docs2,
        "info_card_docs3": data_info_card_docs3,
        "info_card_docs4": data_info_card_docs4
        }

    res.render("user/deposit_scheme_page.ejs", obj);
});

// current deposite page


router.get("/current_deposit_scheme",async function(req,res)
{
    var data= await exe(`SELECT * FROM company`);
    var data11=await exe(`SELECT * FROM footer`);
    var data3 = await exe(`SELECT * FROM loan_details`);
    var data51 = await exe(`SELECT * FROM loan_details`);
    var data_current_deposit_card = await exe(`SELECT * FROM current_deposit_scheme`);
    var data_current_deposit_docs = await exe(`SELECT * FROM current_deposit_scheme_docs`);



    var obj={"company_info":data[0],
        "footer_info":data11[0],
        "loan_scheme":data51,
        "loan_details":data3,
        "current_deposit_card":data_current_deposit_card,
        "current_deposit_docs":data_current_deposit_docs
    }

    res.render("user/current_deposit_scheme.ejs", obj);

});


// current deposit enquirt form 

router.post("/save_current_deposit_enquiry",async function(req,res)
{
    var d = req.body;
    var sql = `INSERT INTO current_deposit_enquiry (current_enquiry_name,
                                                    current_enquiry_email,
                                                    current_enquiry_mobile,
                                                    current_enquiry_city,
                                                    current_enquiry_message)
                                                    VALUES(
                                                    '${d.current_enquiry_name}',
                                                    '${d.current_enquiry_email}',
                                                    '${d.current_enquiry_mobile}',
                                                    '${d.current_enquiry_city}',
                                                    '${d.current_enquiry_message}')`
    var data = await exe(sql);
    res.redirect("/current_deposit_scheme")
});

// term deposit scheme page 

router.get("/term_deposit_scheme",async function(res,res)
{
    var data= await exe(`SELECT * FROM company`);
    var data11=await exe(`SELECT * FROM footer`);
    var data3 = await exe(`SELECT * FROM loan_details`);
    var data51 = await exe(`SELECT * FROM loan_details`);
    var data_term_image = await exe(`SELECT * FROM term_deposit_image`)
    var data_term_details = await exe(`SELECT * FROM term_deposit_scheme_details`)


    var obj={"company_info":data[0],
        "footer_info":data11[0],
        "loan_scheme":data51,
        "loan_details":data3,
        "term_image":data_term_image[0],
        "term_details":data_term_details}
        
    res.render("user/term_deposit_scheme.ejs", obj);
});

router.get("/daily_deposit_scheme", async function (req,res) 
{
    var data= await exe(`SELECT * FROM company`);
    var data11=await exe(`SELECT * FROM footer`);
    var data3 = await exe(`SELECT * FROM loan_details`);
    var data51 = await exe(`SELECT * FROM loan_details`);
    var data_daily_deposit = await exe(`SELECT * FROM daily_deposit_scheme`);

    var obj={"company_info":data[0],
        "footer_info":data11[0],
        "loan_scheme":data51,
        "loan_details":data3,
        "daily_deposit":data_daily_deposit}


    res.render("user/daily_deposit_scheme.ejs",obj)    
});


router.get("/savings_deposit_scheme", async function (req,res) 
{
    var data= await exe(`SELECT * FROM company`);
    var data11=await exe(`SELECT * FROM footer`);
    var data3 = await exe(`SELECT * FROM loan_details`);
    var data51 = await exe(`SELECT * FROM loan_details`);
    var data_saving_image = await exe(`SELECT * FROM saving_deposit_image`);
    var data_saving_details = await exe(`SELECT * FROM saving_deposit_scheme_details`);

    var obj={"company_info":data[0],
        "footer_info":data11[0],
        "loan_scheme":data51,
        "loan_details":data3,
        "saving_image":data_saving_image[0],
        "saving_details":data_saving_details}


    res.render("user/savings_deposit_scheme.ejs",obj)    
});
 

// fixed deposit scheme 

router.get("/fixed_deposit_scheme", async function (req,res) 
{
    var data= await exe(`SELECT * FROM company`);
    var data11=await exe(`SELECT * FROM footer`);
    var data3 = await exe(`SELECT * FROM loan_details`);
    var data51 = await exe(`SELECT * FROM loan_details`);
    var data_fixed_deposit = await exe(`SELECT * FROM fixed_deposit_scheme_details`);
    var data_fixed_deposit_card = await exe(`SELECT * FROM fixed_deposit_scheme_card`);
    var data_fixed_deposit_benefits = await exe(`SELECT * FROM fixed_deposit_scheme_benifits`);



    

    var obj={"company_info":data[0],
        "footer_info":data11[0],
        "loan_scheme":data51,
        "loan_details":data3,
        "fixed_deposit_details":data_fixed_deposit,
        "fixed_deposit_card":data_fixed_deposit_card,
        "fixed_deposit_benifits":data_fixed_deposit_benefits}


    res.render("user/fixed_deposit_scheme.ejs",obj)    
});


// FAQ Page

router.get("/faq",async function(req,res)
{
    var data= await exe(`SELECT * FROM company`);
    var data11=await exe(`SELECT * FROM footer`);
    var data51 = await exe(`SELECT * FROM loan_details`);
    var data3 = await exe(`SELECT * FROM loan_details`);
    var data51 = await exe(`SELECT * FROM loan_details`);
    var data_questions= await exe(`SELECT * FROM faq_questions`);
    var data_answers1= await exe(`SELECT * FROM faq_answers WHERE faq_questions_id = 1`);
    var data_answers2= await exe(`SELECT * FROM faq_answers WHERE faq_questions_id = 2`);
    var data_answers3= await exe(`SELECT * FROM faq_answers WHERE faq_questions_id = 3`);
    var data_answers4= await exe(`SELECT * FROM faq_answers WHERE faq_questions_id = 4`);
    var data_answers5= await exe(`SELECT * FROM faq_answers WHERE faq_questions_id = 5`);
    var data_answers6= await exe(`SELECT * FROM faq_answers WHERE faq_questions_id = 6`);
    var data_answers7= await exe(`SELECT * FROM faq_answers WHERE faq_questions_id = 7`);
    var data_answers8= await exe(`SELECT * FROM faq_answers WHERE faq_questions_id = 8`);



    var obj={"company_info":data[0],
        "footer_info":data11[0],
        "loan_scheme":data51,
        "loan_details":data3,
        "footer_info":data11[0],
        "faq_question":data_questions,
        "faq_answer1":data_answers1,
        "faq_answer2":data_answers2,
        "faq_answer3":data_answers3,
        "faq_answer4":data_answers4,
        "faq_answer5":data_answers5,
        "faq_answer6":data_answers6,
        "faq_answer7":data_answers7,
        "faq_answer8":data_answers8,
        }
    res.render("user/faq.ejs", obj);
});






module.exports = router; 

