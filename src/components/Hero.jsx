import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { assets } from '../assets/assets'
const Hero = () => {
  return (
    <div id='a'  className=' flex flex-col sm:flex-row   bg-gray-50   '>
         
   
        <div   className='w-full sm:w-1/2 flex flex-col   items-center justify-center sm:py-0 py-10'>
             
        <div  className='text-black flex flex-col items-center gap-2 my-3' >
              
              <div className='flex flex-row  gap-2 items-center text-black '>
                <p className='w-7 md:w-14 h-0.5 bg-black'> </p>
                <p className=' text-lg font-serif '> OUR BESTSELLERS </p>

              </div>
               
             </div>
    
          <h1 className='flex flex-col font-semibold text-3xl'> OUR LATEST ARRIVALS</h1>
             
             <div className='flex flex-row gap-2 mt-5 items-center' >
                

                 <Link
              to="/products"
              className="flex items-center gap-2  px-8 py-4 border-2 border-black bg-black/90 text-white text-foreground font-semibold rounded-full  hover:bg-muted transition-colors"
            >
              Shop Now
              <ArrowRight className="h-5 w-5" />
                </Link>


             </div>

    
        </div>

         <img className='w-full sm:w-1/2' src={assets.img_1} alt="img_1" />
     

    </div>
     


        
  )
}

export default Hero