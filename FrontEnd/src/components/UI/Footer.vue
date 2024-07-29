
<template>
<footer>
    <div class="FooterGlobal">
        <div class="frstText">
            <div>
                <span>Consulting Agency For Your Business</span>
                <p>the quick fox jumps over the lazy dog</p>
            </div>
            <a href="">Contact Us</a>

        </div>
        <br><br>
        <div class="SecondText">
            <ul>
                <li class="bigli"><a href="">Company Info</a></li>
                <br>
                <li><a href="">About</a></li>
                <li> <a href="">Carrier</a> </li>
                <li><a href="">We are hiring</a></li>
                <li><a href="">Blog</a></li>


            </ul>
            <ul>
                <li class="bigli"><a href="">Legal</a></li>
                <br>
                <li><a href="">About</a></li>
                <li><a href="">Carrier</a></li>
                <li><a href="">We are hiring</a></li>
                <li><a href="">Blog</a></li>
            </ul>
            <ul>
                <li class="bigli"><a href="">Features</a></li>
                <br>
                <li><a href="">Business Marketing</a></li>
                <li><a href="">User Analytic</a></li>
                <li><a href="">Live Chat</a></li>
                <li><a href="">Unlimited Support</a></li>
            </ul>
            <ul>
                <li class="bigli"><a href="">Ressources</a></li>
                <br>
                <li><a href="">IOS & Android</a></li>
                <li><a href="">Watch a Demo</a></li>
                <li><a href="">Customers</a></li>
                <li><a href="">API</a></li>
            </ul>
            <ul>
                <li><a href="">Get in Touch</a></li>
                <br>
                <li><a href="">(480) 555-0103</a></li>
                <li><a href="">4517 Washington Ave.Kentucky 39495</a></li>
                <li><a href="">debra.holt@example.com</a></li>
                <li></li>
            </ul>
        </div>
        <br><br>

        <div class="Social">

            <span>Made With Love By Finland All Right Reserved </span>

            <div class="logos">
                <img src="../../assets/ui_assets/fb.png" alt="">
                <img src="../../assets/ui_assets/insta.png" alt="">
                <img src="../../assets/ui_assets/twitter.png" alt="">
            </div>

        </div>

    </div>

</footer>
</template>
  <script>
  export default {
    name: 'Footer',
  };
  </script>
  
  <style scoped>
/* FOOTER css */

footer {

background-color: rgba(37, 43, 66, 1);
color: white;
padding: 42px;
height: auto;

}

div.FooterGlobal {}

div.frstText {
justify-content: space-around;
display: flex;
width: 100%;
margin: auto;
}

div.frstText div {}

div.frstText div span {}

div.frstText div p {

font-size: 12px;

}

div.frstText a {
color: white;
background-color: #23a6f0;
border-radius: 10px;
padding: 11px;
width: 11%;
text-align: center;


}

div.SecondText {
font-size: 14px;
justify-content: center;
display: flex;
margin: 33px auto;
width: 100%;

}

div.SecondText ul {}

div.SecondText ul li {

list-style: none;

}

div.SecondText ul li a{

text-decoration: none;
color:white;
}

.bigli {}

div.Social{

display: flex;
width: 100%;
justify-content: space-around;
margin: auto;
}
div.Social span{


}
div.Social div{

display: flex;

}

div.logos img{

width: 17px; margin-left: 12px; height: 16px;
}
  </style>
  