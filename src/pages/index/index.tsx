/** @format */

import { Box, Flex } from '@chakra-ui/layout';
import { Button } from '@chakra-ui/button';
import { Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useColorModeValue } from '@chakra-ui/react';
import { useGetUserLiquidities } from '../../utils/hooks/usePools';
import { Link } from 'react-router-dom';
import "./landingpage.css"

const Index = () => {
  const mode = useColorModeValue('light', 'dark');
  const factory = useGetUserLiquidities();
  const [liquidities, setLiquidities] = useState<any[] | undefined>([]);
  const [liquidityLength, setLiquidityLength] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancel = false;
    const load = async () => {
      const details = await factory;
      if (details && !cancel) {
        try {
          setLiquidities(details.liquidities);
          setLiquidityLength(details.liquidityLength);
          setLoading(details.Loading);
        } catch (err) {
          console.log(err);
        }
      }
    };
    load();
    return () => {
      cancel = true;
    };
  }, [factory]);

  return (
    <>
       <header>
        <div className="header">
         <nav>
          <div className="headerTop">
           <div className="logo">
            <a href="/">
             <img src="./assets/images/logo.svg" alt="logo" className="logo-img" />
            </a>
           </div>
     
           <div className="menuToggle">
            <div className="barsText">
             <div className="bars"></div>
             <div className="bars"></div>
             <div className="bars"></div>
            </div>
            <div className="close-nav"><img src="./assets/images/close-square.svg" alt="" /></div>
           </div>
          </div>
     
          <ul className="menu">
          
           <li className="multi_navbar">
            <div className="multi_navbar_flex">
             <div className="multi_navbar_ul_div_heading"><a>Company</a></div>
             <div><i className="downArrow"></i></div>
            </div>
            <ul className="multi_navbar_ul">
             <div className="multi_navbar_ul_div">
              <div>
               <li>
                <a href="about.html"
                >
                 <div className="multi_navbar_ul_div_item">
                   <p className="multi_nav_head">About us</p>
                  <div>
                   <p>Learn more about rigelProtocol</p>
                  </div>
                 </div>
                </a>
               </li>
               <li>
                <a href="career.html"
                >
                 <div className="multi_navbar_ul_div_item">
                   <p className="multi_nav_head">Career</p>
                  <div>
                   <p>See Available positions</p>
                  </div>
                 </div>
                </a>
               </li>
               <li>
                <a
                 href="press.html"
                >
                 <div className="multi_navbar_ul_div_item">
                   <p className="multi_nav_head">Press resources</p>
                  <div>
                   <p>  Press & media</p>
                  </div>
                 </div>
                </a>
               </li>
            
              </div>
             </div>
            </ul>
           </li>
           <li className="multi_navbar multi_navbar_2">
            <div className="multi_navbar_flex">
             <div className="multi_navbar_ul_div_heading"><a>DApps</a></div>
             <div><i className="downArrow"></i></div>
            </div>
            <ul className="multi_navbar_ul multi_navbar_ul_2">
             <div className="multi_navbar_ul_div">
              <div>
               <li>
                <a
                 href="#"
                >
                 <div className="multi_navbar_ul_div_item">
                   <p className="multi_nav_head">SmartSwap</p>
                  <div>
                   <p>Swap tokens directly</p>
                  </div>
                 </div>
                </a>
               </li>
               <li>
                <a
                 href="gift.rigelprotocol.com"
                >
                 <div className="multi_navbar_ul_div_item">
                   <p className="multi_nav_head">GiftDapp</p>
                  <div>
                   <p>Gifts token in a fun way.</p>
                  </div>
                 </div>
                </a>
               </li>
               <li>
                <a
                href="smartbid.html"
                >
                 <div className="multi_navbar_ul_div_item">
                   <p className="multi_nav_head">SmartBid</p>
                  <div>
                   <p>Bid on tokens.</p>
                  </div>
                 </div>
                </a>
               </li>
               <li>
                <a
                href="leverage-exchange.html"
                >
                 <div className="multi_navbar_ul_div_item">
                   <p className="multi_nav_head">Leverage Exchange</p>
                  <div>
                   <p>Trade using decentralized tokens.</p>
                  </div>
                 </div>
                </a>
               </li>
               <li>
                <a
                 href="launchpad.html"
                >
                 <div className="multi_navbar_ul_div_item">
                   <p className="multi_nav_head">LanchPad</p>
                  <div>
                   <p>Join Project hosted on rigelProtocol</p>
                  </div>
                 </div>
                </a>
               </li>
            
              </div>
             </div>
            </ul>
           </li>
           <li>
            <a href="events.html">Events</a>
           </li>
           <li>
            <a href="https://medium.com/rigelprotocol" target="_blank">Blog <img src ="./assets/images/external.svg" className="ml-1"/></a>
           </li>
          {/* <div className="header__nav__button header__nav__bottom">
            <button>
              <span><a>Launch DApps</a></span>
              <i className="downArrow"></i>
            </button>
           </div>  */}
          </ul>
          <div className="header__nav__button__wrapper">
           <div className="header__nav__button">
            <button>
              <span><a>Launch DApps</a></span>
              <i className="downArrow"></i>
            </button>
           </div>
          </div>
         </nav>
        </div>
       </header>
   <div className="wrapper">
     <main>

       
       <section className="section__1">
<div className="section__1__center">
  <h1>a SMART way to Swap</h1>
  <p>RigelProtocol Launchpad is an end to end tokenization platform combining a technology solution with key compliance and legal aspects.</p>
  <button>
    Launch DApp
  </button>
</div>
       </section>

       
       <section className="section__2">
         <img src="./assets/images/smartswap-dark.svg" alt="smartswap" />   
       </section>
        
        <section className="section__3">
          <div className="section__3__heading">
    <h2>Swap.Liquidity.Farming</h2>
          <p>You have a wide range of functions to perfom with the SmartSwap, either swapping out tokens, providing liquidity or yield farming.</p>
          </div>
         <div className="section__3__top">
          <div>
            <img src="./assets/images/swap.svg" alt="" />
                    </div>
           <div className="section__3__text">
             <h3>Swap</h3>
             <p>To get leverage tokens to trade with, you need to have deposited a certain amount of tokens. So to get started, you go to the SmartSwap Dapp and deposit tokens in the desired token you would like to trade with.</p>
             <div className="section__3__top__button">
               <button>
                 Launch DApp <span>&#8594;</span> 
               </button>
             </div>
           </div>
         </div>
         <div className="section__3__top">
           <div className="section__3__text">
             <h3>Liquidity</h3>
             <p>After depositing your trading token, you can now select a pair with said token and then set your spillage and leverage settings. You get up to 100x leverage for the amount of your deposited tokens for you to trade with.</p>
             <div className="section__3__top__button">
               <button>
                 Launch DApp <span>&#8594;</span>
               </button>
             </div>
           </div>
           <div>
            <img src="./assets/images/liquidity.svg" alt="" />
                    </div>
         </div>
         <div className="section__3__top">
            <div>
            <img src="./assets/images/yieldfarm.svg" alt="" />
           </div>
           <div className="section__3__text">
             <h3>Yield Farming</h3>
             <p>When you trade with the leverage you earn more back. From your earning your leveraged tokens are automatically removed with interest and you get to keep more earnings.</p>
             <div className="section__3__top__button">
               <button>
                 Launch DApp <span>&#8594;</span>
               </button>
             </div>
           </div>
          
         </div>
        </section>
     
     <section className="section__4">
       <div className="section__4__container">
         <div className="section__4__img__container">
        <div>
          <img src="./assets/images/ethereum.svg" alt="ethereum"/>
        </div>
        <div>
          <img src="./assets/images/binance.svg" alt="binance"/>
        </div>
        <div>
          <img src="./assets/images/polygon.svg" alt="polygon"/>
        </div>
       </div>
       <div className="section__4__text">
         <h2>Built across multiple platforms</h2>
         <p>Built on Ethereum, Binance SmartChain, & Polygon to give you the freedom to experience more inclusivity and an extra layer of security when using our platforms.</p>
       </div> 
      </div>
       <div className="section__4__grid">
         <div>
           <div className="section__4__grid__img">
             <img src="./assets/images/security.svg" alt="security"/>
           </div>
           <h4>Extra layer of security</h4>
           <p>Easily exchange between your assets without giving control of your funds to anyone.</p>
         </div>
         <div>
           <div className="section__4__grid__img">
             <img src="./assets/images/fees.svg" alt="fees"/>
           </div>
           <h4>Low transaction fees</h4>
           <p>We offer you the best transaction experience with the lowest fees available.</p>
         </div>
         <div>
           <div className="section__4__grid__img">
             <img src="./assets/images/speed.svg" alt="speed"/>
           </div>
           <h4>Speed of light</h4>
           <p>Your transactions are processed at lightning-fast speed.</p>
         </div>
       
       </div>
       
     </section>
     </main>
     <footer>
      <div className="footer__top">
        <h3>Start your defi journey</h3>
        <p>Build your defi portfolio with DApps that guarantee you fast transaction times, low transaction fees and the best user experience.</p>
        <div className="footer__top__button">
        <button>Launch App</button>
        </div>
      </div>
      <div className="footer__link">
        <div>
          <img src="./assets/images/Darklogo.svg" alt="" />
          <p>DApps with the best experience and low fees.</p>
          <div className="social__media__icon">
              <a  href="https://www.linkedin.com/company/rigelprotocol"
              target="_blank">
                 <img src="./assets/images/Vectorlinkedin.svg" alt="" />
              </a>
            <a href="https://www.t.me/rigelprotocol" target="_blank">
              <img src="./assets/images/Vectortelegram.svg" alt="" />
            </a>
            <a href="https://discord.gg/j86NH95GDD" target="_blank">
              <img src="./assets/images/bi_discorddiscord.svg" alt="" />
            </a>
            <a href="https://twitter.com/rigelprotocol" target="_blank">
              <img src="./assets/images/Vectortwitter.svg" alt="" />
            </a>
            <a href="https://medium.com/rigelprotocol" target="_blank">
              <img src="./assets/images/Vectormedium.svg" alt="" />
            </a>
            <a href="https://github.com/rigelprotocol" target="_blank">
              <img src="./assets/images/Vectorgithub.svg" alt="" />
            </a>
          </div>
        </div>
        <div className="footer__container">
           <div className="footer__li__link">
<div>
<p>Products</p>
<ul>
 <li><a href="https://smartswap.rigelprotocol.com/" target="_blank">SmartSwap</a></li>
 <li><a href="https://gift.rigelprotocol.com/" target="_blank">Gift DApp</a> </li>
 <li> <a
  data-toggle="tooltip"
  data-placement="bottom"
  title="coming soon"
  href="#"
  >Leverage Exchange
</a></li>
 <li> <a
  data-toggle="tooltip"
  data-placement="bottom"
  title="coming soon"
  href="#"
  >SmartBid</a></li>
 <li><a
  data-toggle="tooltip"
  data-placement="bottom"
  title="coming soon"
  href="#">LaunchPad</a></li>
</ul>
</div>
<div>
<p>Company</p>
<ul>
 <li><a href="about.html">About us</a> </li>
 <li><a className="inner-page-link" href="#roadMaps">Road Map</a></li>
 <li><a className="inner-page-link" href="#partners">Partners</a></li>
 <li><a href="press.html">Press Resources</a></li>
</ul>
</div>
<div>
<p>Support</p>
<ul>
 <li><a href="faqs.html">FAQs</a> </li>
 <li><a href="https://medium.com/rigelprotocol" target="_blank">Blog</a></li>
</ul>
</div>
<div>
<p>Legal</p>
<ul>
 <li><a href="design-compliance.html">Design Compliance</a> </li>
 <li><a href="privacy-policy.html">Private Policy</a> </li>
 <li><a href="terms-and-condition.html">Terms & Conditions</a> </li>
</ul>
</div>
        </div> 
        </div>
      
      </div>
    </footer>
   </div>
    </>
  );
};

export default Index;
