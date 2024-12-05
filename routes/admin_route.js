var express= require("express");
var router=express.Router();

var exe= require("./../connection");

function verifyUrl(req,res,next)
{
    if(req.session.admin_login_id == undefined)
    {
        res.redirect("/admin")

    }
    else
    {
        next()
    }
};

router.get("/",async function(req,res)
{
    var data= await exe(`SELECT * FROM company`);
    var obj={"company_info":data[0],
        "is_login":checklogin(req)};
    res.render("admin/login.ejs", obj);
});


// Login Form 
router.post("/do_login",async function(req,res)
{
    var d = req.body;
    var sql = `SELECT * FROM admin_login WHERE admin_user_id = '${d.admin_user_id}' AND admin_password = '${d.admin_password}'`;
    var data = await exe(sql);
    if(data.length)
    {
        req.session.admin_login_id = data[0]['admin_login_id'];
        res.redirect("/admin/home")
    }
    else
    {
        
        
        res.redirect("/admin")
        // res.send("Login Failed")
    }
    // res.send(data)
});



router.get("/logout", function(req,res)
{
    req.session.admin_login_id = undefined;
    res.redirect("/admin")
});

router.get("/update_password",async function(req,res)
{
    var data1 = await exe(`SELECT * FROM admin_login`);
    var data= await exe(`SELECT * FROM company`);
    var obj={"company_info":data[0],
            "is_login":checklogin(req),
            "admin_login_data":data1[0]
    };

    res.render("admin/update_password.ejs",obj)
});

router.post("/update_password",async function(req,res)
{
    var d = req.body;
    
        var sql = `UPDATE admin_login SET admin_password = '${d.new_admin_password1}'`;
        var data = await exe(sql)
        res.redirect("/admin")
    
   
});



function checklogin(req)
{
    if(req.session.admin_login_id)
        return true;
    else
    return false;
}




router.get("/home",verifyUrl, async function(req,res){

    if(req.session.admin_login_id != undefined)
    {
        var data = await exe(`SELECT * FROM company`);
    var data1 = await exe(`SELECT COUNT(*) as no_of_enquires FROM enquiry WHERE enquiry_status='' `);
    var data2 = await exe(`SELECT COUNT(*) as no_of_enquires FROM service_enquiry WHERE status = '' `);
    var data3 = await exe(`SELECT COUNT(*) as no_of_enquires FROM loan_enquiry `);
    var data4 = await exe(`SELECT COUNT(*) as no_of_enquires FROM current_deposit_enquiry `);
    var data5 = await exe(`SELECT COUNT(*) as no_of_enquires FROM contact_enquiry `);


    var obj={"company_info":data[0],
            "is_login":checklogin(req),
            "home_page_enq":data1[0],
            "service_page_enq":data2[0],
            "loan_enquires":data3[0],
            "deposit_enquires":data4[0],
            "contact_enquires":data5[0]
    };
    res.render("admin/index.ejs",obj);
    }
    
    else
    {
    res.redirect("/admin")
    }
});

router.get("/about_company",async function(req,res){
    var data= await exe(`SELECT * FROM company`);
    var obj={"company_info":data[0],"is_login":checklogin(req)};
    res.render("admin/about_company.ejs",obj);
});


router.get("/service_enquiry",async function(req,res)
{
    var data= await exe(`SELECT * FROM company`);
    var data2=await exe(`SELECT * FROM service_enquiry WHERE status='' `);

    var obj={"s_enquirys":data2,"company_info":data[0],"is_login":checklogin(req)};
    res.render("admin/service_enquiry.ejs",obj);
})

router.post("/save_company_details",async function(req,res){
    
    if(req.files){  
        req.body.company_logo = new Date().getTime() + req.files.company_logo.name;
        req.files.company_logo.mv("public/uploads/"+req.body.company_logo);

        var d=req.body;
        var sql=`UPDATE company SET company_name='${d.company_name}', company_email='${d.company_email}',
                                    company_mobile='${d.company_mobile}', company_logo='${d.company_logo}',
                                    company_address='${d.company_address}',
                                    instagram_link='${d.instagram_link}', twitter_link='${d.twitter_link}',
                                    telegram_link='${d.telegram_link}', whatsapp_no='${d.whatsapp_no}',
                                    youtube_link='${d.youtube_link}', facebook_link='${d.facebook_link}',
                                    linkedin_link='${d.linkedin_link}',award='${d.award}',
                                    satisfied_member='${d.satisfied_member}',business='${d.business}',
                                    working_branch='${d.working_branch}',
                                    working_days='${d.working_days}',working_hour='${d.working_hour}',
                                    google_link='${d.google_link}'
                                     `;
      var data=await exe(sql);
     // res.send(req.body);
     // res.send(req.files)
     // res.send(data)
     res.redirect("/admin/about_company")
        
    }
    else{  
        var d=req.body;
        var sql=`UPDATE company SET company_name='${d.company_name}', company_email='${d.company_email}',
                                        company_mobile='${d.company_mobile}', 
                                        company_address='${d.company_address}',
                                        instagram_link='${d.instagram_link}', twitter_link='${d.twitter_link}',
                                        telegram_link='${d.telegram_link}', whatsapp_no='${d.whatsapp_no}',
                                        youtube_link='${d.youtube_link}', facebook_link='${d.facebook_link}',
                                        linkedin_link='${d.linkedin_link}',award='${d.award}',
                                    satisfied_member='${d.satisfied_member}',business='${d.business}',
                                    working_branch='${d.working_branch}',
                                    working_days='${d.working_days}',working_hour='${d.working_hour}',
                                    google_link='${d.google_link}' `;
        var data=await exe(sql);
        // res.send(req.body);
        // res.send(req.files)
        // res.send(data)
        res.redirect("/admin/about_company");
        
    }
  

});
router.get("/footer",async function(req,res){
    var data=await exe(`SELECT * FROM footer`);
    var obj={"footer_info":data[0],"is_login":checklogin(req)};
    res.render("admin/user_footer.ejs",obj);
});
router.post("/save_footer_detail",function(req,res){    
    if(req.files){  
        var d=req.body;
        req.body.footer_logo = new Date().getTime() + req.files.footer_logo.name;
        req.files.footer_logo.mv("public/uploads/"+req.body.footer_logo);

    var sql=`UPDATE footer SET footer_logo_title='${d.footer_logo_title}',
                             address='${d.address}', district='${d.district}',
                              pincode='${d.pincode}', map='${d.map}', footer_logo='${d.footer_logo}'
                                `;
    var data=exe(sql);
    // res.send(data);
    res.redirect("/admin/footer");
    }
    else{
        var d=req.body;
        var sql=`UPDATE footer SET footer_logo_title='${d.footer_logo_title}',
                             address='${d.address}', district='${d.district}',
                              pincode='${d.pincode}', map='${d.map}'
                              `;
        var data=exe(sql);
        res.redirect("/admin/footer");
    }
});

router.get("/enquiry",async function(req,res){
    var sql=`SELECT * FROM enquiry Where enquiry_status='' `;
    var data= await exe(sql);
    var obj={"enquirys":data,"is_login":checklogin(req)};
    res.render("admin/enquiry.ejs",obj,);
});
router.get("/complete_enquiry/:enquiry_id",function(req,res){
    var id=req.params.enquiry_id;     
    var sql=`UPDATE enquiry SET enquiry_status='complete' where enquiry_id='${id}'`;
    // res.send(req.body);
    var data=exe(sql);
    res.redirect("/admin/enquiry");
});
router.get("/complete_service_enquiry/:service_enquiry_id",function(req,res){
    var id=req.params.service_enquiry_id;     
    var sql=`UPDATE service_enquiry SET status='complete' WHERE service_enquiry_id='${id}'`;
    // res.send(req.body);
    var data=exe(sql);
    res.redirect("/admin/enquiry");
});

router.get("/top_slider",async function(req,res){
    var sql=`SELECT * FROM top_slider`;
    var data=await exe(sql);
    var obj={"slider":data,"is_login":checklogin(req)};
 
    res.render("admin/top_slider.ejs",obj)
});
router.post("/save_top_slider",async function(req,res){
    if(req.files){  
        req.body.slider_image = new Date().getTime() + req.files.slider_image.name;
        req.files.slider_image.mv("public/uploads/"+req.body.slider_image);
    
    d=req.body;
    var sql=`INSERT INTO top_slider(slider_image) VALUES ('${d.slider_image}')`;
    var data=exe(sql);
    
    //  res.send(req.files)
    //  res.send(data)
     res.redirect("/admin/top_slider")
        
    }
});
router.get("/delete_slider/:top_slider_id", async function(req,res) {
    var id=req.params.top_slider_id;
        
    var sql=`DELETE FROM top_slider where top_slider_id='${id}'`;
    // res.send(req.body);
    var data=exe(sql);
    res.redirect("/admin/top_slider");
});

router.get("/customer_support",async function(req,res){
    var sql=`SELECT * FROM customer_support where customer_support_status=' ' `;
    var data=await exe(sql);
    var obj={"c_support":data,"is_login":checklogin(req)}
    res.render("admin/customer_support.ejs",obj);
});
router.get("/complete_customer_support/:customer_support_id",function(req,res){
    var id=req.params.customer_support_id;
        
    var sql=`UPDATE customer_support SET customer_support_status='complete' where customer_support_id='${id}'`;
    // res.send(req.body);
    var data=exe(sql);
    res.redirect("/admin/customer_support");
});

router.get("/home_our_service",async function(req,res){
    var data=await exe(`SELECT * FROM home_our_service`);
    var obj={"home_service_img":data,"is_login":checklogin(req)};
    res.render("admin/home_our_service.ejs",obj);
});
router.post("/save_home_our_service", function(req,res){
    if(req.files){  
        req.body.home_service_image = new Date().getTime() + req.files.home_service_image.name;
        req.files.home_service_image.mv("public/uploads/"+req.body.home_service_image);
    
    d=req.body;
    var sql=`INSERT INTO home_our_service(home_service_image,service_image_heading) VALUES 
                ('${d.home_service_image}','${d.service_image_heading}' )`;
    // var sql=`CREATE TABLE home_our_service (home_our_service_id INT PRIMARY KEY AUTO_INCREMENT, home_service_image TEXT, 
    //         service_image_heading VARCHAR(400) )`;
    var data=exe(sql);
    
    //  res.send(req.files)
    //  res.send(data);
     res.redirect("/admin/home_our_service");
        
    };
});
router.get("/delete_home_service/:home_our_service_id", async function(req,res) {
    var id=req.params.home_our_service_id;
        
    var sql=`DELETE FROM home_our_service where home_our_service_id='${id}'`;
    // res.send(req.body);
    var data=exe(sql);
    res.redirect("/admin/home_our_service");
});
router.get("/edit_home_service/:home_our_service_id", async function(req,res) {
    var id=req.params.home_our_service_id;
        
    var sql=`SELECT * FROM home_our_service where home_our_service_id='${id}'`;
    // res.send(req.body);
    var data=await exe(sql);
    var obj={"edit_service_info":data[0],"is_login":checklogin(req)};
    res.render("admin/edit_home_service.ejs",obj);
});
router.post("/update_home_service/:home_our_service_id",function(req,res){
    var id=req.params.home_our_service_id;

    if(req.files){  
        req.body.home_service_image = new Date().getTime() + req.files.home_service_image.name;
        req.files.home_service_image.mv("public/uploads/"+req.body.home_service_image);
    
    var d=req.body;
    var sql=`UPDATE home_our_service SET home_service_image='${d.home_service_image}',
                                        service_image_heading='${d.service_image_heading}'
                                    WHERE home_our_service_id='${id}' `;
    var data=exe(sql);
     res.redirect("/admin/home_our_service")
    }
    else{  
        var d=req.body;
        var sql=`UPDATE home_our_service SET 
                                        service_image_heading='${d.service_image_heading}'
                                    WHERE home_our_service_id='${id}' `;
        var data=exe(sql);
         res.redirect("/admin/home_our_service")        
    }    
})



router.get("/home_about_us_info",async function(req,res){
    var data=await exe(`SELECT * FROM home_about_info`);
    var obj={"home_about_info":data,"is_login":checklogin(req)}
    res.render("admin/home_about_us_info.ejs",obj);
});
router.post("/save_home_about_info",function(req,res){
    if(req.files){  
        req.body.title_image = new Date().getTime() + req.files.title_image.name;
        req.files.title_image.mv("public/uploads/"+req.body.title_image);
    
    var d=req.body;
    // var sql=`CREATE TABLE home_about_info(home_about_info_id INT PRIMARY KEY AUTO_INCREMENT, title TEXT, title_header TEXT,
    //         title_detail TEXT, title_image TEXT)`;
    var sql=`INSERT INTO home_about_info(title, title_header, title_detail, title_image) VALUES
            ('${d.title}', '${d.title_header}', '${d.title_detail}', '${d.title_image}')`;
    var data=exe(sql);
    
    //  res.send(req.files)
    //  res.send(data)
     res.redirect("/admin/home_about_us_info")
        
    };
});
router.get("/delete_home_about_info/:home_about_info_id",function(req,res){
    var id=req.params.home_about_info_id;
        
    var sql=`DELETE FROM home_about_info where home_about_info_id='${id}'`;
    // res.send(req.body);
    var data=exe(sql);
    res.redirect("/admin/home_about_us_info");
});
router.get("/edit_home_about_info/:home_about_info_id",async function(req,res){
    var id=req.params.home_about_info_id;
        
    var sql=`SELECT * FROM home_about_info where home_about_info_id='${id}'`;
    var data=await exe(sql);
    var obj={"edit_info":data[0],"is_login":checklogin(req)}
    res.render("admin/update_home_about_info.ejs",obj)
});
router.post("/update_home_about_info/:home_about_info_id", async function(req,res){
    var id=req.params.home_about_info_id;

    if(req.files){  
        req.body.title_image = new Date().getTime() + req.files.title_image.name;
        req.files.title_image.mv("public/uploads/"+req.body.title_image);
    
    var d=req.body;
    var sql=`UPDATE home_about_info SET title='${d.title}', title_header='${d.title_header}',
                             title_detail='${d.title_detail}', title_image='${d.title_image}'
                             WHERE home_about_info_id='${id}' `;
    var data=exe(sql);
     res.redirect("/admin/home_about_us_info")
    }
    else{  
        var d=req.body;
        var sql=`UPDATE home_about_info SET title='${d.title}', title_header='${d.title_header}',
                                 title_detail='${d.title_detail}'
                                 WHERE home_about_info_id='${id}' `;
        var data=exe(sql);
         res.redirect("/admin/home_about_us_info")        
    }
   
});

router.get("/home_facility_provide",async function(req,res){
    var data=await exe(`SELECT * FROM home_facility`);
    var obj={"facilities":data,"is_login":checklogin(req)}
    res.render("admin/home_facility_provide.ejs",obj);
});
router.post("/save_home_facility",function(req,res){
    if(req.files){  
        req.body.facility_image = new Date().getTime() + req.files.facility_image.name;
        req.files.facility_image.mv("public/uploads/"+req.body.facility_image);
    
    var d=req.body;
    // var sql=`CREATE TABLE home_facility(home_facility_id INT PRIMARY KEY AUTO_INCREMENT, facility_header TEXT,
    //         facility_detail TEXT, facility_image TEXT)`;
    var sql=`INSERT INTO home_facility(facility_header, facility_detail, facility_image) VALUES
                ('${d.facility_header}','${d.facility_detail}','${d.facility_image}')`;
    var data=exe(sql);
    // res.send(data);
    res.redirect("/admin/home_facility_provide");

    };

});
router.get("/delete_home_facility/:home_facility_id",function(req,res){
    var id=req.params.home_facility_id;
        
    var sql=`DELETE FROM home_facility where home_facility_id='${id}'`;
    // res.send(req.body);
    var data=exe(sql);
    res.redirect("/admin/home_facility_provide");
});
router.get("/edit_home_facility/:home_facility_id",async function(req,res){
    var id=req.params.home_facility_id;
    var sql=`SELECT * FROM home_facility WHERE home_facility_id='${id}' `;
    var data=await exe(sql);
    var obj={"edit_facility":data[0],"is_login":checklogin(req)};
    res.render("admin/update_home_facility.ejs",obj);
});
router.post("/update_home_facility/:home_facility_id",function(req,res){
    var id=req.params.home_facility_id;

    if(req.files){  
        req.body.facility_image = new Date().getTime() + req.files.facility_image.name;
        req.files.facility_image.mv("public/uploads/"+req.body.facility_image);
    
    var d=req.body;

    var sql=`UPDATE home_facility SET facility_header='${d.facility_header}',
                                     facility_detail='${d.facility_detail}',
                                     facility_image='${d.facility_image}'
                             WHERE home_facility_id='${id}' `;
    var data=exe(sql);
     res.redirect("/admin/home_facility_provide")
    }
    else{  
        var d=req.body;
        var sql=`UPDATE home_facility SET facility_header='${d.facility_header}',
                                        facility_detail='${d.facility_detail}'
                                 WHERE home_facility_id='${id}' `;
        var data=exe(sql);
         res.redirect("/admin/home_facility_provide")        
    }

});

router.get("/feature",async function(req,res){
    var sql=`SELECT * FROM feature`;
    var data2=await exe(`SELECT * FROM heading`);
    var data=await exe(sql,);
    var obj={"features":data,"heading":data2,"is_login":checklogin(req)};
    res.render("admin/feature.ejs",obj);
})
router.post("/save_feature", function(req,res){
    var d=req.body;
    // var sql=`CREATE TABLE feature(feature_id INT PRIMARY KEY AUTO_INCREMENT, feature_heading TEXT, feature TEXT)`;
    var sql=`INSERT INTO feature (feature) VALUES ('${d.feature}')`;
    var data= exe (sql);
    res.redirect("/admin/feature");
});
router.get("/delete_feature/:feature_id",function(req,res){
    var id=req.params.feature_id;
    var sql=`DELETE FROM feature WHERE feature_id='${id}'`;
    var data=exe (sql);
    res.redirect("/admin/feature");
});
router.get("/edit_feature/:feature_id",async function(req,res){
    var id=req.params.feature_id;
    var sql=`SELECT * FROM feature WHERE feature_id='${id}' `;
    var data=await exe(sql);
    var obj={"edit_feature":data,"is_login":checklogin(req)}
    res.render("admin/edit_feature.ejs", obj)
});
router.post("/update_feature/:feature_id",async function(req,res){
    var id=req.params.feature_id;
    var d=req.body;
    var sql=`UPDATE feature SET feature='${d.feature}' WHERE feature_id='${id}' `;
    var data=await exe(sql);
    res.redirect("/admin/feature");
})

router.get("/edit_heading/:heading_id",async function(req,res){
    var id=req.params.heading_id;
    var sql=`SELECT * FROM heading WHERE heading_id='${id}' `;
    var data=await exe(sql);
    var obj={"f_heading":data,"is_login":checklogin(req)}
    res.render("admin/edit_feature_heading.ejs",obj);
});
router.post("/upadate_feature_heading/:heading_id",async function(req,res){
    var id=req.params.heading_id;
    var d=req.body;
    var sql=`UPDATE heading SET feature_heading='${d.feature_heading}' WHERE heading_id='${id}' `;
    var data=await exe(sql);
    res.redirect("/admin/feature");
});

router.get("/eligibility",async function(req,res){
    var data2=await exe(`SELECT * FROM heading`);
    var sql=`SELECT * FROM eligibility`;
    var data=await exe(sql);
    var obj={"eligibilities":data,"heading":data2,"is_login":checklogin(req)}
    res.render("admin/eligibility.ejs",obj);
});
router.post("/save_eligibility",function(req,res){
    var d=req.body;
    // var sql=`CREATE TABLE eligibility (eligibility_id INT PRIMARY KEY AUTO_INCREMENT, eligibility TEXT)`;
    var sql=`INSERT INTO eligibility (eligibility) VALUES ('${d.eligibility}')`;
    var data=exe(sql);
    // res.send(data);
    res.redirect("/admin/eligibility")
});
router.get("/delete_eligibility/:eligibility_id",function(req,res){
    var id=req.params.eligibility_id;
    var sql=`DELETE FROM eligibility WHERE eligibility_id='${id}'`;
    var data=exe (sql);
    res.redirect("/admin/eligibility");
});
router.get("/edit_eligibility/:eligibility_id",async function(req,res){
    var id=req.params.eligibility_id;
    var sql=`SELECT * FROM eligibility WHERE eligibility_id='${id}' `;
    var data=await exe(sql);
    var obj={"edit_eligibility":data,"is_login":checklogin(req)}
    res.render("admin/edit_eligibility.ejs", obj)
});
router.post("/update_eligibilities/:eligibility_id",async function(req,res){
    var id=req.params.eligibility_id;
    var d=req.body;
    var sql=`UPDATE eligibility SET eligibility='${d.eligibility}' WHERE eligibility_id='${id}' `;
    var data=await exe(sql);
    res.redirect("/admin/eligibility");
});

router.get("/edit_eligibility_heading/:heading_id",async function(req,res){
    var id=req.params.heading_id;
    var sql=`SELECT * FROM heading WHERE heading_id='${id}' `;
    var data=await exe(sql);
    var obj={"f_heading":data,"is_login":checklogin(req)}
    res.render("admin/edit_eligibility_heading.ejs",obj);
});
router.post("/upadate_eligibility_heading/:heading_id",async function(req,res){
    var id=req.params.heading_id;
    var d=req.body;
    var sql=`UPDATE heading SET eligibility_heading='${d.eligibility_heading}' WHERE heading_id='${id}' `;
    var data=await exe(sql);
    res.redirect("/admin/eligibility");
});

router.get("/document",async function(req,res){
    var data2=await exe(`SELECT * FROM heading`);
    var sql=`SELECT * FROM document`;
    var data=await exe(sql);
    var obj={"documents":data,"heading":data2,"is_login":checklogin(req)};    
    res.render("admin/document.ejs",obj);
});
router.post("/save_document",function(req,res){
    var d=req.body;
    // var sql=`CREATE TABLE document (document_id INT PRIMARY KEY AUTO_INCREMENT, document TEXT)`;
    var sql=`INSERT INTO document (document) VALUES ('${d.document}')`;
    var data=exe(sql);
    // res.send(data);
    res.redirect("/admin/document")
});
router.get("/delete_document/:document_id",function(req,res){
    var id=req.params.document_id;
    var sql=`DELETE FROM document WHERE document_id='${id}'`;
    var data=exe (sql);
    res.redirect("/admin/document");
});
router.get("/edit_document/:document_id",async function(req,res){
    var id=req.params.document_id;
    var sql=`SELECT * FROM document WHERE document_id='${id}' `;
    var data=await exe(sql);
    var obj={"edit_document":data,"is_login":checklogin(req)}
    res.render("admin/edit_document.ejs", obj)
});
router.post("/update_documents/:document_id",async function(req,res){
    var id=req.params.document_id;
    var d=req.body;
    var sql=`UPDATE document SET document='${d.document}' WHERE document_id='${id}' `;
    var data=await exe(sql);
    res.redirect("/admin/document");
});
router.get("/edit_document_heading/:heading_id",async function(req,res){
    var id=req.params.heading_id;
    var sql=`SELECT * FROM heading WHERE heading_id='${id}' `;
    var data=await exe(sql);
    var obj={"f_heading":data,"is_login":checklogin(req)}
    res.render("admin/edit_document_heading.ejs",obj);
});
router.post("/upadate_document_heading/:heading_id",async function(req,res){
    var id=req.params.heading_id;
    var d=req.body;
    var sql=`UPDATE heading SET document_heading='${d.document_heading}' WHERE heading_id='${id}' `;
    var data=await exe(sql);
    res.redirect("/admin/document");
});

router.get("/video",async function(req,res){
    var data=await exe(`SELECT * FROM video`);
    var obj={"videos":data,"is_login":checklogin(req)};
    res.render("admin/video.ejs",obj);
});
router.post("/save_video",function(req,res){
    var d=req.body;
    // var sql=`CREATE TABLE video (video_id INT PRIMARY KEY AUTO_INCREMENT, video_link URL, video_title TEXT,
    //              card_title TEXT, video_description TEXT)`;
    var sql=`INSERT INTO video (video_link, video_title, card_title, video_description) VALUES
                                 ('${d.video_link}', '${d.video_title}', '${d.card_title}', '${d.video_description}')`;
    var data=exe(sql);
    // res.send(data);
    res.redirect("/admin/video");
});
router.get("/delete_video/:video_id",async function(req,res){
    var id=req.params.video_id;
    var sql=`DELETE FROM video WHERE video_id='${id}' `;
    var data=await exe(sql);
    res.redirect("/admin/video");
});
router.get("/edit_video_detail/:video_id",async function(req,res){
    var id=req.params.video_id;
    var sql=`SELECT * FROM video WHERE video_id='${id}' `;
    var data=await exe(sql);
    var obj={"video":data,"is_login":checklogin(req)};
    res.render("admin/edit_video_detail.ejs",obj);
});
router.post("/update_video/:video_id",async function(req,res){
    var id=req.params.video_id;
    var d=req.body;
    var sql=`UPDATE video SET video_link='${d.video_link}', video_title='${d.video_title}',
                                card_title='${d.card_title}', video_description='${d.video_description}' WHERE
                                video_id='${id}' `;
    var data=await exe(sql);
    res.redirect("/admin/video");
});
router.get("/bank_partner",async function(req,res){
    var sql=`SELECT * FROM bank_partner`;
    var data=await exe(sql);
    var obj={"bank_partner":data,"is_login":checklogin(req)}
    res.render("admin/bank_partner.ejs",obj);
}); 
router.post("/save_bank_image",function(req,res){
    if(req.files){  
        req.body.bank_partner_image = new Date().getTime() + req.files.bank_partner_image.name;
        req.files.bank_partner_image.mv("public/uploads/"+req.body.bank_partner_image);
    var d=req.body;
    var sql=`INSERT INTO bank_partner (bank_partner_image) VALUES ('${d.bank_partner_image}' )`;
    var data=exe(sql);
    // res.send(data);
    res.redirect("/admin/bank_partner");
    }
});
router.get("/delete_bank_image/:bank_partner_image_id",async function(req,res){
    var id=req.params.bank_partner_image_id;
    var sql=`DELETE FROM bank_partner WHERE bank_partner_image_id='${id}}' `;
    var data=await exe(sql);
    res.redirect("/admin/bank_partner");
})


// Home Page End
// Service Page Start 

router.get("/service_info",async function(req,res){
    var data= await exe(`SELECT * FROM service_page_info`);
    var obj={"s_info":data[0],"is_login":checklogin(req)};
    res.render("admin/service_info.ejs",obj);
});
router.post("/save_service_info",async function(req,res){
    if(req.files){  
        req.body.service_page_image = new Date().getTime() + req.files.service_page_image.name;
        req.files.service_page_image.mv("public/uploads/"+req.body.service_page_image);
    var d=req.body;
    // var sql=`CREATE TABLE service_page_info(service_page_info_id INT PRIMARY KEY AUTO_INCREMENT,
    //         service_page_title TEXT, service_page_heading TEXT, service_page_image TEXT)`;
    var sql=`UPDATE service_page_info SET service_page_title='${d.service_page_title}',
                                          service_page_heading='${d.service_page_heading}',
                                          service_page_image='${d.service_page_image}'  `;                           
    var data=await exe(sql);
    res.redirect("/admin/service_info")
    }
    else{
        var d=req.body;
        var sql=`UPDATE service_page_info SET service_page_title='${d.service_page_title}',
                                              service_page_heading='${d.service_page_heading}'  `; 
        var data=await exe(sql);
        res.redirect("/admin/service_info")
    }; 
});
router.get("/add_service",async function(req,res){
    var data=await exe(`SELECT * FROM service`);
    var obj={"services":data,"is_login":checklogin(req)}
    res.render("admin/add_service.ejs",obj);
});
router.post("/save_service",async function(req,res){
    if(req.files){  
        req.body.service_image = new Date().getTime() + req.files.service_image.name;
        req.files.service_image.mv("public/uploads/"+req.body.service_image);
    var d=req.body;
    var sql=`INSERT INTO service(service_title, service_description, service_icon, service_image ) VALUES
                ('${d.service_title}','${d.service_description}','${d.service_icon}','${d.service_image}' )`;
    var data=await exe(sql)
    }
    // res.send(data)
    res.redirect("/admin/add_service");
})
router.get("/delete_service/:service_id",async function(req,res){
    var id=req.params.service_id;
    var sql=`DELETE FROM service WHERE service_id='${id}' `;
    var data=await exe(sql);
    res.redirect("/admin/add_service");
});
router.get("/edit_service/:service_id",async function(req,res){
    var id=req.params.service_id;
    var sql=`SELECT * FROM service WHERE service_id='${id}'  `;
    var data=await exe(sql);
    var obj={"service":data,"is_login":checklogin(req)}
    res.render("admin/edit_service.ejs",obj);
});
router.post("/save_edit_service/:service_id",async function(req,res){
    var id=req.params.service_id;
    var d=req.body;
    if(req.files & req.body.service_icon ){  
        req.body.service_image = new Date().getTime() + req.files.service_image.name;
        req.files.service_image.mv("public/uploads/"+req.body.service_image);
    var sql=`UPDATE service SET service_title='${d.service_title}',service_description='${d.service_description}',
                                service_image='${d.service_image}'
                                WHERE service_id='${id}' `;
    var data=await exe(sql);
    res.redirect("/admin/add_service");    
    }
    else{
    var sql=`UPDATE service SET service_title='${d.service_title}',service_description='${d.service_description}'
                                 WHERE service_id='${id}' `;
    var data=await exe(sql);
    res.redirect("/admin/add_service"); 
    }
});

// notice Page Start 

router.get("/notice_info",async function(req,res){
    var data= await exe(`SELECT * FROM notice_page_info`);
    var obj={"notice_info":data[0],"is_login":checklogin(req)};
    res.render("admin/notice_info.ejs",obj);
});
router.post("/save_notice_info",async function(req,res){
    if(req.files){  
        req.body.notice_page_image = new Date().getTime() + req.files.notice_page_image.name;
        req.files.notice_page_image.mv("public/uploads/"+req.body.notice_page_image);
    var d=req.body;
    // var sql=`CREATE TABLE notice_page_info(notice_page_info_id INT PRIMARY KEY AUTO_INCREMENT,
    //          notice_page_title TEXT,  notice_page_image TEXT)`;
    var sql=`UPDATE notice_page_info SET notice_page_title='${d.notice_page_title}',
                                           notice_page_image='${d.notice_page_image}'  `;                           
    
    var data=await exe(sql);
    // res.send(data);
    res.redirect("/admin/notice_info")
    }
    else{
        var d=req.body;
        var sql=`UPDATE notice_page_info SET notice_page_title='${d.notice_page_title}' `;
        var data=await exe(sql);
        res.redirect("/admin/notice_info")
    }; 
});
router.get("/add_notice",async function(req,res){
    var data=await exe(`SELECT * FROM notice`);
    var obj={"notices":data,"is_login":checklogin(req)}
    res.render("admin/add_notice.ejs",obj);
});
router.post("/save_notice",async function(req,res){
    if(req.files){  
        req.body.notice_image = new Date().getTime() + req.files.notice_image.name;
        req.files.notice_image.mv("public/uploads/"+req.body.notice_image);
    var d=req.body;
    // var sql=`CREATE TABLE notice(notice_image_id INT PRIMARY KEY AUTO_INCREMENT, notice_image TEXT)`
    var sql=`INSERT INTO notice(  notice_image ) VALUES('${d.notice_image}' )`;
    var data=await exe(sql)
    }
    // res.send(data)
    res.redirect("/admin/add_notice");
});
router.get("/delete_notice/:notice_image_id",async function(req,res){
    var id=req.params.notice_image_id;
    var sql=`DELETE FROM notice WHERE notice_image_id='${id}' `;
    var data=await exe(sql);
    res.redirect("/admin/add_notice");
});
router.get("/edit_notice/:notice_image_id",async function(req,res){
    var id=req.params.notice_image_id;
    var sql=`SELECT * FROM notice WHERE notice_image_id='${id}'  `;
    var data=await exe(sql);
    var obj={"notice":data,"is_login":checklogin(req)}
    res.render("admin/edit_notice.ejs",obj);
});
router.post("/save_edit_notice/:notice_image_id",async function(req,res){
    var id=req.params.notice_image_id;
    var d=req.body;
    if(req.files ){  
        req.body.notice_image = new Date().getTime() + req.files.notice_image.name;
        req.files.notice_image.mv("public/uploads/"+req.body.notice_image);
    var sql=`UPDATE notice SET 
                                notice_image='${d.notice_image}'
                                WHERE notice_image_id='${id}' `;
    var data=await exe(sql);
    }
    res.redirect("/admin/add_notice");    


    
});
router.get("/view_notice/:notice_image_id",async function(req,res){
    var id=req.params.notice_image_id;
    var sql=`SELECT * FROM notice WHERE notice_image_id='${id}' `;
    var data=await exe (sql);
    var obj={"notices":data[0],"is_login":checklogin(req)};
    res.render("admin/view_notice.ejs",obj);
});

// Term and condition page start
router.get("/term_&_condition",async function(req,res){
    var data=await exe(`SELECT * FROM t_c_page_info`);
    var obj={"tc_info":data[0],"is_login":checklogin(req)}
    res.render("admin/term_condition.ejs", obj);
});
router.post("/save_t&c_info",async function(req,res){
    if(req.files){  
    var d=req.body;
    
    req.body.t_c_page_image =new Date().getTime() + req.files.t_c_page_image.name;
    req.files.t_c_page_image.mv("public/uploads/"+req.body.t_c_page_image);
    var sql=`UPDATE t_c_page_info SET t_c_page_title='${d.t_c_page_title}' ,
                                      t_c_page_image='${d.t_c_page_image}'  `;                           
    
    var data=await exe(sql);
    // res.send(data);
    res.redirect("/admin/term_&_condition")
    }
    else{
        var d=req.body;
        var sql=`UPDATE t_c_page_info SET t_c_page_title='${d.t_c_page_title}' `;
        var data=await exe(sql);
        res.redirect("/admin/term_&_condition")
    }; 
});

// About Page Start

router.get("/about_organization",async function(req,res){
    var sql=`SELECT * FROM about_page`
    var data=await exe(sql);
    var obj={"about":data[0],"is_login":checklogin(req)}
    res.render("admin/about_organization.ejs",obj)
});
router.post("/save_about_organization",async function(req,res){
    if(req.files){  
        var d=req.body;
        
        req.body.about_image =new Date().getTime() + req.files.about_image.name;
        req.files.about_image.mv("public/uploads/"+req.body.about_image);

        var sql2=`UPDATE about_page SET about_heading='${d.about_heading}',
                                        about_description='${d.about_description}' ,
                                        about_image='${d.about_image}' 
                    `;
    var data=await exe(sql2);
    // res.send(data);
    res.redirect("/admin/about_organization")
    }
    else{
        var d=req.body;
        var sql2=`UPDATE about_page SET about_heading='${d.about_heading}',
                                        about_description='${d.about_description}' `;
        var data=await exe(sql2);
        // res.send(data);
        res.redirect("/admin/about_organization")
    }

});

router.get("/add_about_branch",async function(req,res){
    var sql=`SELECT * FROM about_branch`;
    var data=await exe(sql);
    var obj={"branch":data,"is_login":checklogin(req)}
    
    res.render("admin/add_about_branch.ejs",obj);
});
router.post("/save_about_branch",async function(req,res){
    var d=req.body;
    var sql=`INSERT INTO about_branch ( branch_city,branch_header,branch_lane ,branch_lane2 ,branch_dist,branch_no )
                    VALUES ('${d.branch_city}','${d.branch_header}','${d.branch_lane}','${d.branch_lane2}',
                    '${d.branch_dist}','${d.branch_no}')`;
    var data=await exe(sql);
    // res.send(data);
    res.redirect("/admin/add_about_branch");
});
router.get("/delete_branch/:about_branch_id",async function(req,res){
    var id=req.params.about_branch_id;
    var sql=`DELETE FROM about_branch WHERE about_branch_id='${id}' `;
    var data=await exe(sql);
    res.redirect("/admin/add_about_branch");
});
router.get("/edit_branch/:about_branch_id",async function(req,res) {
    var id=req.params.about_branch_id;
    var sql=`SELECT * FROM about_branch WHERE about_branch_id='${id}' `;
    var data=await exe(sql);
    var obj={"branch":data[0],"is_login":checklogin(req)}
    res.render("admin/edit_about_branch.ejs",obj)
});
router.post("/update_about_branch/:about_branch_id",async function (req,res) {
    var id=req.params.about_branch_id;
    var d=req.body;
    var sql=`UPDATE about_branch SET branch_city='${d.branch_city}',
                                    branch_header='${d.branch_header}',
                                    branch_lane ='${d.branch_lane}',
                                    branch_lane2='${d.branch_lane2}' ,
                                    branch_dist='${d.branch_dist}',
                                    branch_no ='${d.branch_no}' WHERE about_branch_id='${id}'
                     `;
    var data=await exe(sql);
    res.redirect("/admin/add_about_branch");
});

router.get("/about_our_vision",async function(req,res){
    var data=await exe(`SELECT * FROM about_our_vision`);
    var obj={"vision":data[0],"is_login":checklogin(req)};
    res.render("admin/about_our_vision.ejs",obj)
});
router.post("/save_about_our_vision",async function (req,res){
    if(req.files){  
        var d=req.body;
        
        req.body.our_vision_image =new Date().getTime() + req.files.our_vision_image.name;
        req.files.our_vision_image.mv("public/uploads/"+req.body.our_vision_image);

        var sql=`UPDATE  about_our_vision SET
                            our_vision_description='${d.our_vision_description}' ,
                            our_vision_image='${d.our_vision_image}' `;

    var data=await exe(sql);
    // res.send(data);
    res.redirect("/admin/about_our_vision")
    }
    else{
        var d=req.body;
    var sql=`UPDATE  about_our_vision SET
    our_vision_description='${d.our_vision_description}'  `;
    var data=await exe(sql);
    // res.send(data);
    res.redirect("/admin/about_our_vision")
    }
});

router.get("/about_our_history",async function(req,res){
    var data=await exe(`SELECT * FROM about_our_history`);
    var obj={"history":data[0],"is_login":checklogin(req)}
    res.render("admin/about_our_history.ejs",obj)
});
router.post("/save_about_our_history",async function(req,res) {
    if(req.files){  
        var d=req.body; 
        req.body.our_history_image =new Date().getTime() + req.files.our_history_image.name;
        req.files.our_history_image.mv("public/uploads/"+req.body.our_history_image);

        var sql=`UPDATE about_our_history SET
                    our_history_image='${d.our_history_image}' , 
                    our_history_description='${d.our_history_description}' `;
        var data=await exe(sql);
    // res.send(data);
    res.redirect("/admin/about_our_history")
    }    
    else{
        var d=req.body; 
        var sql=`UPDATE about_our_history SET our_history_description='${d.our_history_description}' `;
        var data=await exe(sql);
        // res.send(data);
        res.redirect("/admin/about_our_history")
    }
});

router.get("/about_our_mission",async function(req,res){
    var data=await exe(`SELECT * FROM about_our_mission`);
    var obj={"mission":data[0],"is_login":checklogin(req)}
    res.render("admin/about_our_mission.ejs",obj)
});
router.post("/save_about_our_mission",async function(req,res) {
    if(req.files){  
        var d=req.body; 
        req.body.our_mission_image =new Date().getTime() + req.files.our_mission_image.name;
        req.files.our_mission_image.mv("public/uploads/"+req.body.our_mission_image);

        var sql=`UPDATE about_our_mission SET
                our_mission_description='${d.our_mission_description}' ,
                 our_mission_image='${d.our_mission_image}' `;

        var data=await exe(sql);
    // res.send(data);
    res.redirect("/admin/about_our_mission")
    } 
    else{
        var d=req.body; 
        var sql=`UPDATE about_our_mission SET
                our_mission_description='${d.our_mission_description}'  `;

        var data=await exe(sql);
    // res.send(data);
    res.redirect("/admin/about_our_mission")

    }
});

router.get("/get_in_touch",async function(req,res){
    var data=await exe(`SELECT * FROM get_in_touch`);
    var obj={"get_touch":data[0],"is_login":checklogin(req)}
    res.render("admin/get_in_touch.ejs",obj);
});
router.post("/save_get_in_touch",async function(req,res){
    var d=req.body;
    var sql=`UPDATE get_in_touch SET
                head_office_address='${d.head_office_address}' ,
                contact_no ='${d.contact_no}',email='${d.email}' ,time='${d.time}' `;
    var data=await exe(sql); 
    // res.send(data);
    res.redirect("/admin/get_in_touch");
});

router.get("/happy_customer",async function(req,res){
    var data=await exe(`SELECT * FROM customer_review`);
    var obj={"review":data,"is_login":checklogin(req)}
    res.render("admin/happy_customer.ejs",obj)
});
router.post("/save_happy_reviews",async function (req,res) {
    if(req.files){  
        var d=req.body;
        req.body.customer_image =new Date().getTime() + req.files.customer_image.name;
        req.files.customer_image.mv("public/uploads/"+req.body.customer_image);
    var sql=`INSERT INTO customer_review (customer_name ,customer_position ,about_description ,customer_image )VALUES
            ('${d.customer_name}','${d.customer_position}','${d.about_description}','${d.customer_image}' )`
    var data=await exe(sql);
    res.redirect("/admin/happy_customer");
    }
    
})
router.get("/delete_review/:customer_review_id", async function(req,res){
    var id=req.params.customer_review_id;
    var sql=`DELETE FROM customer_review WHERE customer_review_id='${id}' `;
    var data=await exe(sql);
    res.redirect("/admin/happy_customer");
});
router.get("/edit_review/:customer_review_id", async function(req,res){
    var id=req.params.customer_review_id;
    var data=await exe(`SELECT * FROM customer_review WHERE customer_review_id='${id}' `);
    var obj={"review":data[0],"is_login":checklogin(req)};
    res.render("admin/edit_review.ejs",obj)
});
router.post("/update_happy_reviews/:customer_review_id",async function(req,res){
    var id=req.params.customer_review_id;
    if(req.files){  
        var d=req.body;
        req.body.customer_image =new Date().getTime() + req.files.customer_image.name;
        req.files.customer_image.mv("public/uploads/"+req.body.customer_image);
        
        var sql=`UPDATE customer_review SET customer_name='${d.customer_name}',
                                             customer_position='${d.customer_position}',
                                             about_description='${d.about_description}',
                                             customer_image='${d.customer_image}'
                                             `;
        var data=await exe (sql);
        res.redirect("/admin/happy_customer")
    }
    else{
        var d=req.body;
        var sql=`UPDATE customer_review SET customer_name='${d.customer_name}',
                customer_position='${d.customer_position}',
                    about_description='${d.about_description}'
                     `;
        var data=await exe(sql);
        res.redirect("/admin/happy_customer");
    }
})

// chairman Page Start

router.get("/chairman_slider",async function(req,res){
    var data=await exe(`SELECT * FROM chairman_slider`);
    var obj={"slider":data,"is_login":checklogin(req)};
    res.render("admin/chairman_slider.ejs",obj);
});
router.post("/save_chairman_slider",async function (req,res){
    if(req.files){  
        var d=req.body;
        req.body.chairman_slider_image =new Date().getTime() + req.files.chairman_slider_image.name;
        req.files.chairman_slider_image.mv("public/uploads/"+req.body.chairman_slider_image);
    var sql=`INSERT INTO chairman_slider(chairman_slider_image ) VALUES ('${d.chairman_slider_image}' )`;
    var data=await exe(sql);
    // res.send(data);
    res.redirect("/admin/chairman_slider");

    }
});
router.get("/delete_chairman_slider/:chairman_slider_id",async function(req,res){
    var id=req.params.chairman_slider_id;
    var sql=`DELETE FROM chairman_slider WHERE chairman_slider_id='${id}' `;
    var data=await exe(sql);
    res.redirect("/admin/chairman_slider");
});

router.get("/chairman_decription",async function(req,res){
    var data=await exe(`SELECT * FROM chairman_detail`);
    var obj={"chairman_info":data[0],"is_login":checklogin(req)}
    res.render("admin/chairman_detail.ejs",obj);
});
router.post("/save_chairman_details",function(req,res){
    var d=req.body;
    var sql=`UPDATE chairman_detail SET chairman_name='${d.chairman_name}' , 
                                        chairman_info='${d.chairman_info}' ,
                                        chairman_description=${d.chairman_description}' `;
    var data=exe(sql);
    // res.send(data);
    res.redirect("/admin/chairman_description");
});

router.get("/chairman_gallery",async function(req,res){
    var data=await exe (`SELECT * FROM chairman_gallery`);
    var obj={"gallery":data,"is_login":checklogin(req)}
    res.render("admin/chairman_gallery.ejs",obj);
})
router.post("/save_chairman_gallery",async function(req,res){
    if(req.files){  
        var d=req.body;
        req.body.chairman_gallery_image =new Date().getTime() + req.files.chairman_gallery_image.name;
        req.files.chairman_gallery_image.mv("public/uploads/"+req.body.chairman_gallery_image);
    var sql=`INSERT INTO chairman_gallery( chairman_gallery_image  )VALUES ('${d.chairman_gallery_image}' )`;
    var data=await exe(sql);
    // res.send(data);
    res.redirect("/admin/chairman_gallery");
    }
});
router.get("/delete_chairman_gallery/:chairman_gallery_id",async function(req,res){
    var id=req.params.chairman_gallery_id;
    var sql=`DELETE FROM chairman_gallery WHERE chairman_gallery_id='${id}' `;
    var data=await exe (sql);
    res.redirect("/admin/chairman_gallery");
})







// Shreyas sir Work


router.get("/add_loan",async function(req,res)
{
    var data = await exe(`SELECT * FROM loan_details`);
    var obj = {"loan_details":data,"is_login":checklogin(req)};
    res.render("admin/add_loan.ejs",obj);
});


// Save Loan Details Form

router.post("/save_loan_details",async function(req,res)
{
    req.body.loan_image = new Date().getTime() + req.files.loan_image.name;
    req.files.loan_image.mv("public/uploads/"+req.body.loan_image);
    var d = req.body;
    var sql = `INSERT INTO loan_details(
                                        loan_name, 
                                        loan_tenure, 
                                        loan_intrest_rate, 
                                        loan_image, 
                                        loan_shortnote, 
                                        loan_description, 
                                        loan_feature) VALUES (
                                        '${d.loan_name}', 
                                        '${d.loan_tenure}', 
                                        '${d.loan_intrest_rate}', 
                                        '${d.loan_image}', 
                                        '${d.loan_shortnote}', 
                                        '${d.loan_description}', 
                                        '${d.loan_feature}')`;
    var data = await exe(sql);
    // res.send(d);
    res.redirect("/admin/add_loan");
});





// View Loan Details Page

router.get("/view_loan/:loan_type_id",async function(req,res)
{
    var id = req.params.loan_type_id;
    var sql = `SELECT * FROM loan_details WHERE loan_type_id = '${id}'`;
    var sql1 = `SELECT * From loan_docs_apps WHERE loan_type_id = '${id}'  AND LENGTH(loan_documents) > 0`;
    var sql2 = `SELECT * From loan_docs_apps WHERE loan_type_id = '${id}'  AND LENGTH(loan_application) > 0`;
    var data = await exe(sql);
    var data1 = await exe(sql1);
    var data2 = await exe(sql2);
    var obj = {
        "loan_info":data[0],
        "loan_docs1":data1,
        "loan_docs2":data2,"is_login":checklogin(req)
    };
    res.render("admin/view_loan.ejs", obj);
});


// Edit Loan Details Page

router.get("/edit_loan/:loan_type_id",async function(req,res)
{
    var id = req.params.loan_type_id;
    var sql = `SELECT * FROM loan_details WHERE loan_type_id = '${id}'`;
    var data = await exe(sql);
    var obj = {
            "loan_info":data[0],"is_login":checklogin(req)
    };
    res.render("admin/edit_loan.ejs", obj);
});


// Update Loan Details Form

router.post("/update_loan_details",async function(req,res)
{
    var d = req.body;
    if(req.files.loan_image){
    var loan_image = new Date().getTime()+req.files.loan_image.name;
    req.files.loan_image.mv("public/uploads/"+loan_image);
    var imgsql = `UPDATE loan_details SET loan_image = '${loan_image}' WHERE loan_type_id = '${d.loan_type_id}'`;
    await exe(imgsql);
    };


    var sql = `UPDATE loan_details SET
                loan_name = '${d.loan_name}', 
                loan_tenure = '${d.loan_tenure}', 
                loan_intrest_rate = '${d.loan_intrest_rate}', 
                loan_shortnote = '${d.loan_shortnote}', 
                loan_description = '${d.loan_description}', 
                loan_feature = '${d.loan_feature}'
                WHERE loan_type_id = '${d.loan_type_id}' `;
    var data = await exe(sql);
    // res.send(req.body);
    res.redirect("/admin/loan_list");
});


// Delate Loan 

router.get("/delete_loan/:loan_type_id",async function(req,res)
{
    var id = req.params.loan_type_id;
    var sql = `DELETE FROM loan_details WHERE loan_type_id = '${id}'`;
    var data = await exe(sql);
    res.redirect("/admin/loan_list");
});


// Loan Documents And Application Page

router.get("/loan_docs_apps",async function(req,res)
{
    var data = await exe(`SELECT * FROM loan_details`);
        var data2 = await exe(`Select * FROM loan_docs_apps ORDER BY loan_type_id`);
    var obj = {"loan_details":data,
                "loan_docs":data2,"is_login":checklogin(req)
    };
    res.render("admin/loan_docs_apps.ejs",obj);
});


// Save Loan Documents And Application From

router.post("/save_loan_docs_apps",async function(req,res)
{
    var d = req.body;
    var sql = `INSERT INTO loan_docs_apps(loan_type_id,
                                        loan_documents,
                                        loan_application) Values(
                                        '${d.loan_type_id}',
                                        '${d.loan_documents}',
                                        '${d.loan_application}')`;
    var data = await exe(sql);
    // res.send(data);
    res.redirect("/admin/loan_docs_apps");   
});


// Delete Loan Documents And Application

router.get("/delete_app_docs/:app_docs_id",async function(req,res)
{
    var id = req.params.app_docs_id;
    var sql = `DELETE FROM loan_docs_apps WHERE app_docs_id = '${id}'`;
    var data = await exe(sql);
    res.redirect("/admin/loan_docs_apps");
});


// Loan Enquiry Page

router.get("/loan_enquiry",async function(req,res)
{
    var sql = `SELECT * FROM loan_enquiry`;
    var data = await exe(sql);
    var obj = {
                "enq_details":data,"is_login":checklogin(req)
    };
    res.render("admin/loan_enquiry.ejs",obj);
});


// Delete Loan Enquiry 

router.get("/delete_enquiry_details/:loan_enquiry_id",async function(req,res)
{
    var id = req.params.loan_enquiry_id;
    var sql = `DELETE FROM loan_enquiry WHERE loan_enquiry_id = '${id}'`;
    var data = await exe(sql);
    res.redirect("/admin/loan_enquiry");
});



// Contact Us Enquiry Page

router.get("/contact_enquiry",async function(req,res)
{
    var sql = `SELECT * FROM contact_enquiry`;
    var data = await exe(sql);
    var obj = {"contact_enquiry":data,"is_login":checklogin(req)};
    res.render("admin/contact_enquiry.ejs", obj);
});


// Delete Contact Us 

router.get("/delete_contact_enquiry_details/:contact_enq_id",async function(req,res)
{
    var id = req.params.contact_enq_id;
    var sql = `DELETE FROM contact_enquiry WHERE contact_enq_id = '${id}'`;
    var data = await exe(sql);
    res.redirect("/admin/contact_enquiry");
});


//Gallery Page

router.get("/gallery_info",async function(req,res)
{
    var sql1 = `SELECT * FROM gallery WHERE LENGTH(gallery_image_caption) > 0 AND LENGTH(gallery_image) > 0`
    var sql2 = `SELECT * FROM gallery WHERE LENGTH(gallery_video_caption) > 0 AND LENGTH(gallery_video) > 0`
    var sql3 = `SELECT gallery_bg_image FROM gallery_background_img`;
    data1 = await exe(sql1);
    data2 = await exe(sql2);
    data3 = await exe(sql3);
    var obj = {
        "gallery_image":data1,
        "gallery_video":data2,
        "gallery_bg":data3[0],"is_login":checklogin(req)
    }
    res.render("admin/gallery_info.ejs",obj);
});


// Save Images And Videos To Gallery

router.post("/save_gallery_details",async function(req,res)
{
    if(req.files.gallery_image)
    {
    req.body.gallery_image = new Date().getTime() + req.files.gallery_image.name;
    req.files.gallery_image.mv("public/uploads/"+req.body.gallery_image);
    }
    
    if(req.files.gallery_video)
    {
    req.body.gallery_video = new Date().getTime() + req.files.gallery_video.name;
    req.files.gallery_video.mv("public/uploads/"+req.body.gallery_video);
    }
    var d = req.body;
    var sql = `INSERT INTO gallery(gallery_image_caption,
                                    gallery_image,
                                    gallery_video_caption,
                                    gallery_video) 
                                    VALUES ('${d.gallery_image_caption}',
                                    '${d.gallery_image}',
                                    '${d.gallery_video_caption}',
                                    '${d.gallery_video}'
                                    )`;
    var data  = await exe(sql);
    // res.send(data);
    res.redirect("/admin/gallery_info")
});


// Save Gallery Background Image

router.post("/save_gallery_background",async function(req,res)
{
    if(req.files)
    {
    req.body.gallery_bg_image = new Date().getTime() + req.files.gallery_bg_image.name;
    req.files.gallery_bg_image.mv("public/uploads/"+req.body.gallery_bg_image); 
    }
    var d = req.body;
    var sql = `UPDATE gallery_background_img SET gallery_bg_image = ('${d.gallery_bg_image}')`
    var data = await exe(sql);
    res.redirect("/admin/gallery_info")
});


// Delete Gallery Image

router.get("/Delete_image_details/:gallery_id",async function(req,res)
{
    var id = req.params.gallery_id;
    var sql = `UPDATE gallery SET gallery_image_caption = null, gallery_image = null WHERE gallery_id = '${id}'`;
    var data = await exe(sql);
    res.redirect("/admin/gallery_info");
});


// Delete Gallery Video

router.get("/Delete_video_details/:gallery_id",async function(req,res)
{
    var id = req.params.gallery_id;
    var sql = `UPDATE gallery SET gallery_video_caption = null, gallery_video = null WHERE gallery_id = '${id}'`;
    var data = await exe(sql);
    res.redirect("/admin/gallery_info");
});


// faq page


router.get("/faq",async function(req,res)
{
    var data= await exe(`SELECT * FROM company`);
    var data1= await exe(`SELECT * FROM faq_questions`);
    var data2= await exe(`SELECT * FROM faq_answers ORDER BY faq_questions_id`);

    var obj={"company_info":data[0],
            "is_login":checklogin(req),
            "faq_question":data1,
            "faq_answer":data2
    };
     res.render("admin/faq.ejs",obj);
});
router.post("/save_faq_question",async function(req,res)
{
    var d = req.body;
    var sql = `INSERT INTO faq_questions(faq_question) VALUES ('${d.faq_question}')`;
    data = await exe(sql);
    res.redirect("/admin/faq")
});
router.get("/delete_faq_question/:faq_questions_id",async function(req,res)
{
    var id = req.params.faq_questions_id;
    var sql = `DELETE FROM faq_questions WHERE faq_questions_id = '${id}'`;
    var data = await exe(sql);
    res.redirect("/admin/faq");
});
router.post("/save_faq_answer",async function(req,res)
{
    var d = req.body;
    var sql = `INSERT INTO faq_answers(faq_questions_id,faq_answer) VALUES ('${d.faq_questions_id}','${d.faq_answer}')`;
    var data = await exe(sql);
    res.redirect("/admin/faq");
});
router.get("/delete_faq_answer/:faq_answers_id",async function(req,res)
{
    var id = req.params.faq_answers_id;
    var sql = `DELETE FROM faq_answers WHERE faq_answers_id = '${id}'`;
    var data = await exe(sql);
    res.redirect("/admin/faq");
});

// deposite Page


router.get("/deposit_schemes_page",async function(req,res)
{
    var data = await exe(`SELECT * FROM company`);
    var data2 = await exe(`SELECT * FROM deposit_scheme_slide`)
    var data3 = await exe(`SELECT * FROM deposit_scheme_card`)
    var data4 = await exe(`SELECT * FROM deposit_info_card`)
    var data5 = await exe(`SELECT * FROM deposit_info_card, info_card_docs WHERE deposit_info_card.info_card_id = info_card_docs.info_card_id ORDER BY info_card_title`)

    // console.log(data5)
    var obj={"company_info":data[0],
        "is_login":checklogin(req),
        "deposit_slides":data2,
        "deposit_card":data3,
        "deposit_info_card":data4,
        "deposit_info_card_docs":data5
        };
    res.render("admin/deposit_schemes_page.ejs",obj)
});



router.post("/save_deposit_scheme_slide",async function(req,res)
{
    if(req.files)
        {
        req.body.slide_image = new Date().getTime() + req.files.slide_image.name;
        req.files.slide_image.mv("public/uploads/"+req.body.slide_image); 
        }
    var d = req.body;
    var sql = `INSERT INTO deposit_scheme_slide (slide_title, 
                                                 slide_details, 
                                                 slide_image)
                                                 VALUES (
                                                 '${d.slide_title}', 
                                                 '${d.slide_details}', 
                                                 '${d.slide_image}'
                                                 )`;
    data = await exe(sql);
    res.redirect("/admin/deposit_schemes_page");
});

router.get("/delete_slide/:slide_id",async function(req,res)
{
    var id = req.params.slide_id;
    var sql = `DELETE FROM deposit_scheme_slide WHERE slide_id = '${id}'`;
    var data = await exe(sql);
    res.redirect("/admin/deposit_schemes_page");
});



router.post("/save_deposit_info_card",async function(req,res)
{
    var d = req.body;
    var sql = `INSERT INTO deposit_info_card (info_card_title, 
                                              info_card_details) 
                                                 VALUES (
                                                 '${d.info_card_title}', 
                                                 '${d.info_card_details}'
                                                 )`;
    data = await exe(sql);
    res.redirect("/admin/deposit_schemes_page");
});


router.get("/delete_info_card/:info_card_id",async function(req,res)
{
    var id = req.params.info_card_id;
    var sql = `DELETE FROM deposit_info_card WHERE info_card_id = '${id}'`;
    var data = await exe(sql);
    res.redirect("/admin/deposit_schemes_page");
});



router.post("/save_deposit_info_card_docs",async function(req,res)
{
    var d = req.body;
    var sql = `INSERT INTO info_card_docs (info_card_id , 
                                              info_card_docs ) 
                                                 VALUES (
                                                 '${d.info_card_id}', 
                                                 '${d.info_card_docs}'
                                                 )`;
    data = await exe(sql);
    res.redirect("/admin/deposit_schemes_page");
});



router.get("/delete_info_card_docs/:info_card_docs_id",async function(req,res)
{
    var id = req.params.info_card_docs_id;
    var sql = `DELETE FROM info_card_docs WHERE info_card_docs_id = '${id}'`;
    var data = await exe(sql);
    res.redirect("/admin/deposit_schemes_page");
});




// Current Deposit Page

router.get("/current_deposit_scheme_page",async function(req,res)
{
    var data = await exe(`SELECT * FROM company`);
    var data1 = await exe(`SELECT * FROM current_deposit_scheme`)
    var data2 = await exe(`SELECT * FROM current_deposit_scheme_docs`)
    var data3 = await exe(`SELECT * FROM current_deposit_enquiry`)
    var obj={"company_info":data[0],
            "is_login":checklogin(req),
            "current_deposit_card":data1,
            "current_deposit_docs":data2,
            "current_deposit_enquiry":data3}
    res.render("admin/current_deposit_scheme_page.ejs", obj)
});


router.post("/save_current_deposit_scheme_card",async function(req,res)
{
    if(req.files)
        {
        req.body.current_card_image = new Date().getTime() + req.files.current_card_image.name;
        req.files.current_card_image.mv("public/uploads/"+req.body.current_card_image); 
        }
    var d = req.body;
    var sql = `INSERT INTO current_deposit_scheme (current_card_image,
                                                   current_card_details 
                                                   )
                                                   VALUES(
                                                   '${d.current_card_image}',
                                                   '${d.current_card_details}' 
                                                   )`
    data = await exe(sql);
    res.redirect("/admin/current_deposit_scheme_page");
});


router.get("/delete_current_deposit_card/:current_card_id",async function(req,res)
{
    var id = req.params.current_card_id;
    var sql = `DELETE FROM current_deposit_scheme WHERE current_card_id = '${id}'`;
    var data = await exe(sql);
    res.redirect("/admin/current_deposit_scheme_page");
});



router.post("/save_current_deposit_scheme_docs",async function(req,res)
{
    var d = req.body;
    var sql = `INSERT INTO current_deposit_scheme_docs (current_deposit_docs)
                                                        VALUES ('${d.current_deposit_docs}')`
    var data = await exe(sql);
    res.redirect("/admin/current_deposit_scheme_page");
});


router.get("/delete_current_deposit_docs/:current_docs_id",async function(req,res)
{
    var id = req.params.current_docs_id;
    var sql = `DELETE FROM current_deposit_scheme_docs WHERE current_docs_id = '${id}'`;
    var data = await exe(sql);
    res.redirect("/admin/current_deposit_scheme_page");
});


router.get("/delete_current_deposit_enquiry/:current_deposit_enquiry_id",async function(req,res)
{
    var id = req.params.current_deposit_enquiry_id;
    var sql = `DELETE FROM current_deposit_enquiry WHERE current_deposit_enquiry_id = '${id}'`;
    var data = await exe(sql);
    res.redirect("/admin/current_deposite_enquiry");
});


router.get("/current_deposite_enquiry", async function(req,res){
    
    var data = await exe(`SELECT * FROM company`);
    var data1 = await exe(`SELECT * FROM current_deposit_scheme`)
    var data2 = await exe(`SELECT * FROM current_deposit_scheme_docs`)
    var data3 = await exe(`SELECT * FROM current_deposit_enquiry`)
    var obj={"company_info":data[0],
            "is_login":checklogin(req),
            "current_deposit_card":data1,
            "current_deposit_docs":data2,
            "current_deposit_enquiry":data3}
    
    res.render("admin/current_deposite_enquiry.ejs",obj)
})

// term deposits page 

router.get("/term_deposit_scheme", async function(req,res) 
{
    var data = await exe(`SELECT * FROM company`);
    var data1 = await exe(`SELECT * FROM term_deposit_image`)
    var data2 = await exe(`SELECT * FROM term_deposit_scheme_details`)
    
    var obj={"company_info":data[0],
            "is_login":checklogin(req),
            "term_image":data1[0],
            "term_details":data2};
    res.render("admin/term_deposit_scheme.ejs", obj)
});



router.post("/save_term_deposit_scheme_image",async function(req,res)
{
    if(req.files)
        {
        req.body.term_deposit_image = new Date().getTime() + req.files.term_deposit_image.name;
        req.files.term_deposit_image.mv("public/uploads/"+req.body.term_deposit_image); 
        }
    var d = req.body;

    var sql = `UPDATE term_deposit_image SET term_deposit_image = '${d.term_deposit_image}'`;
    var data = await exe(sql);
    res.redirect("/admin/term_deposit_scheme")
});



router.post("/save_term_deposit_scheme_details",async function(req,res)
{
    var d = req.body;
    var sql = `INSERT INTO term_deposit_scheme_details (term_deposit_details)
                                                        VALUES ('${d.term_deposit_details}')`;
    var data = await exe(sql);
    res.redirect("/admin/term_deposit_scheme")

});




router.get("/delete_term_details/:term_deposit_scheme_id",async function(req,res)
{
    var id = req.params.term_deposit_scheme_id;
    var sql = `DELETE FROM term_deposit_scheme_details WHERE term_deposit_scheme_id = '${id}'`;
    var data = await exe(sql);
    res.redirect("/admin/term_deposit_scheme");
});


// daily deposit page

router.get("/daily_deposit_scheme_page",async function(req,res)
{
    var data = await exe(`SELECT * FROM company`);
    var data1 = await exe(`SELECT * FROM daily_deposit_scheme`);

    var obj={"company_info":data[0],
            "is_login":checklogin(req),
            "daily_deposit_details":data1}

    res.render("admin/daily_deposit_scheme_page.ejs", obj);
});


router.post("/save_daily_deposit_scheme_details", async function(req,res) 
{
    var d = req.body;
    var sql = `INSERT INTO daily_deposit_scheme (daily_deposit_duration, daily_deposit_intrest) 
                                                    VALUES ('${d.daily_deposit_duration}','${d.daily_deposit_intrest}')`
    var data = await exe(sql);
    res.redirect("/admin/daily_deposit_scheme_page");
});


router.get("/delete_daily_deposit_details/:daily_deposit_scheme_id",async function(req,res)
{
    var id = req.params.daily_deposit_scheme_id;
    var sql = `DELETE FROM daily_deposit_scheme WHERE daily_deposit_scheme_id = '${id}'`;
    var data = await exe(sql);
    res.redirect("/admin/daily_deposit_scheme_page");
});



// savings deposit page 


router.get("/saving_deposit_scheme", async function(req,res) 
{
    var data = await exe(`SELECT * FROM company`);
    var data1 = await exe(`SELECT * FROM saving_deposit_image`);
    var data2 = await exe(`SELECT * FROM saving_deposit_scheme_details`);

    
    var obj={"company_info":data[0],
            "is_login":checklogin(req),
            "saving_image":data1[0],
            "saving_details":data2}
    res.render("admin/saving_deposit_scheme.ejs", obj)
});



router.post("/save_saving_deposit_scheme_image",async function(req,res)
{
    if(req.files)
        {
        req.body.saving_deposit_image = new Date().getTime() + req.files.saving_deposit_image.name;
        req.files.saving_deposit_image.mv("public/uploads/"+req.body.saving_deposit_image); 
        }
    var d = req.body;
    var sql = `UPDATE saving_deposit_image SET saving_deposit_image = '${d.saving_deposit_image}'`;
    var data = await exe(sql);
    res.redirect("/admin/saving_deposit_scheme");
});



router.post("/save_saving_deposit_scheme_details",async function(req,res)
{
    var d = req.body;
    var sql = `INSERT INTO saving_deposit_scheme_details (saving_deposit_details)
                                                        VALUES ('${d.saving_deposit_details}')`;
    var data = await exe(sql);
    res.redirect("/admin/saving_deposit_scheme")

});




router.get("/delete_saving_details/:saving_deposit_scheme_id",async function(req,res)
{
    var id = req.params.saving_deposit_scheme_id;
    var sql = `DELETE FROM saving_deposit_scheme_details WHERE saving_deposit_scheme_id = '${id}'`;
    var data = await exe(sql);
    res.redirect("/admin/saving_deposit_scheme");
});


// fixed deopsit scheme 
router.get("/fixed_deposit_scheme_page",async function(req,res)
{
    var data = await exe(`SELECT * FROM company`);
    var data1 = await exe(`SELECT * FROM fixed_deposit_scheme_details`);
    var data2 = await exe(`SELECT * FROM fixed_deposit_scheme_card`);
    var data3 = await exe(`SELECT * FROM fixed_deposit_scheme_benifits`);


    var obj={"company_info":data[0],
            "is_login":checklogin(req),
            "fixed_deposit_details":data1,
            "fixed_deposit_card":data2,
            "fixed_deposit_benifits":data3}

    res.render("admin/fixed_deposit_scheme_page.ejs", obj);
});


router.post("/save_fixed_deposit_scheme_details", async function (req,res) 
{
    var d = req.body;
    var sql = `INSERT INTO fixed_deposit_scheme_details (principle_amount,
                                                        interest_rate,
                                                        tenure,
                                                        interest_frequency,
                                                        interest_earned,
                                                        maturity_amount)
                                                        VALUES (
                                                        '${d.principle_amount}',
                                                        '${d.interest_rate}',
                                                        '${d.tenure}',
                                                        '${d.interest_frequency}',
                                                        '${d.interest_earned}',
                                                        '${d.maturity_amount}')`;
    var data = await exe(sql);
    res.redirect("/admin/fixed_deposit_scheme_page")
});


router.get("/delete_fixed_deposit_details/:fixed_deposit_scheme_details_id",async function(req,res)
{
    var id = req.params.fixed_deposit_scheme_details_id;
    var sql = `DELETE FROM fixed_deposit_scheme_details WHERE fixed_deposit_scheme_details_id = '${id}'`;
    var data = await exe(sql);
    res.redirect("/admin/fixed_deposit_scheme_page");
});


router.post("/save_fixed_deposit_scheme_card", async function (req,res) 
{
    if(req.files)
        {
        req.body.fixed_deposit_card_image = new Date().getTime() + req.files.fixed_deposit_card_image.name;
        req.files.fixed_deposit_card_image.mv("public/uploads/"+req.body.fixed_deposit_card_image); 
        }
    var d = req.body;
    var sql = `INSERT INTO fixed_deposit_scheme_card (fixed_deposit_card_image,
                                                        fixed_deposit_card_title,
                                                        fixed_deposit_card_details)
                                                        VALUES (
                                                        '${d.fixed_deposit_card_image}',
                                                        '${d.fixed_deposit_card_title}',
                                                        '${d.fixed_deposit_card_details}')`;
    var data = await exe(sql);
    res.redirect("/admin/fixed_deposit_scheme_page")
});



router.get("/delete_fixed_deposit_card/:fixed_deposit_scheme_card_id",async function(req,res)
{
    var id = req.params.fixed_deposit_scheme_card_id;
    var sql = `DELETE FROM fixed_deposit_scheme_card WHERE fixed_deposit_scheme_card_id = '${id}'`;
    var data = await exe(sql);
    res.redirect("/admin/fixed_deposit_scheme_page");
});


router.post("/save_fixed_deposit_scheme_benefits", async function (req,res) 
{
    var d = req.body;
    var sql = `INSERT INTO fixed_deposit_scheme_benifits (benifits)
                                                        VALUES ('${d.benifits}')`;
    var data = await exe(sql);
    res.redirect("/admin/fixed_deposit_scheme_page")
});



router.get("/delete_fixed_deposit_benifits/:fixed_deposit_scheme_benifits_id",async function(req,res)
{
    var id = req.params.fixed_deposit_scheme_benifits_id;
    var sql = `DELETE FROM fixed_deposit_scheme_benifits WHERE fixed_deposit_scheme_benifits_id = '${id}'`;
    var data = await exe(sql);
    res.redirect("/admin/fixed_deposit_scheme_page");
});



router.get("/team",async function(req,res)
{
    var data = await exe(`SELECT * FROM company`);
    var data1 = await exe(`SELECT * FROM team_manager_details`);
    var data2 = await exe(`SELECT * FROM team_member_details`);



    var obj={"company_info":data[0],
            "is_login":checklogin(req),
            "manager_details":data1,
            "team_member_details":data2}

    res.render("admin/team.ejs", obj);
});


router.post("/save_team_manager",async function(req,res) 
{
    if(req.files)
        {
        req.body.manager_image = new Date().getTime() + req.files.manager_image.name;
        req.files.manager_image.mv("public/uploads/"+req.body.manager_image); 
        }
    var d = req.body;
    var sql = `INSERT INTO team_manager_details(manager_image,
                                                manager_name,
                                                manager_position,
                                                manager_details,
                                                manager_twitter,
                                                manager_facebook)
                                                VALUES (
                                                '${d.manager_image}',
                                                '${d.manager_name}',
                                                '${d.manager_position}',
                                                '${d.manager_details}',
                                                '${d.manager_twitter}',
                                                '${d.manager_facebook}')`;

    var data = await exe(sql);
    res.redirect("/admin/team");
});


router.get("/delete_manager_details/:team_manager_details_id",async function(req,res)
{
    var id = req.params.team_manager_details_id;
    var sql = `DELETE FROM team_manager_details WHERE team_manager_details_id = '${id}'`;
    var data = await exe(sql);
    res.redirect("/admin/fixed_deposit_scheme_page");
});

router.post("/save_team_member",async function(req,res) 
{
    if(req.files)
        {
        req.body.team_member_image = new Date().getTime() + req.files.team_member_image.name;
        req.files.team_member_image.mv("public/uploads/"+req.body.team_member_image); 
        }
    var d = req.body;
    var sql = `INSERT INTO team_member_details(team_member_image,
                                                team_member_name,
                                                team_member_position,
                                                team_member_details,
                                                team_member_twitter,
                                                team_member_facebook)
                                                VALUES (
                                                '${d.team_member_image}',
                                                '${d.team_member_name}',
                                                '${d.team_member_position}',
                                                '${d.team_member_details}',
                                                '${d.team_member_twitter}',
                                                '${d.team_member_facebook}')`;

    var data = await exe(sql);
    res.redirect("/admin/team");
});


router.get("/delete_team_member_details/:team_member_details_id",async function(req,res)
{
    var id = req.params.team_member_details_id;
    var sql = `DELETE FROM team_member_details WHERE team_member_details_id = '${id}'`;
    var data = await exe(sql);
    res.redirect("/admin/fixed_deposit_scheme_page");
});








module.exports = router; 

