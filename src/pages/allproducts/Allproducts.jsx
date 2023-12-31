import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Layout from '../../components/layout/Layout';
import myContext from '../../context/data/myContext';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../redux/cartSlice';
import ImageGrid from '../../components/imagegrid/Imagegrid';


function AllProducts() {
  const context = useContext(myContext);
  const {
    mode,
    product,
    searchkey,
    filterType,
    setFilterType,
  } = context;

  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart);

  const [selectedPriceIndex, setSelectedPriceIndex] = useState(0);

  const addCart = (product) => {
    dispatch(addToCart(product));
    toast.success('Added to cart');
  };

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Manually specify the price ranges
  const priceRanges = [1000, 800, 400, 200]; // Add more ranges as needed

  const handlePriceRangeChange = (event) => {
    const index = event.target.value;
    setSelectedPriceIndex(index);
  };

  return (
    <Layout>
      
      <section className={`text-gray-600 body-font ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="container px-5 py-8 md:py-16 mx-auto"
   
        style={{ fontFamily:'Lilita One' }}>
           <div className=" w-auto mb-6 lg:mb-10">
            <h1
              className={` lg:text-6xl text-3xl text-center font-bold title-font mb-2    ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}
              style={{ fontFamily:'Lilita One' }}
            >
              Our Latest Collection
            </h1>
         
          </div>
<ImageGrid />
          
          {/* Price Filter Dropdown */}
          <div className="flex items-center mb-4">
            <label className="mr-2 text-gray-700">Select Price Range:</label>
            <select
              value={selectedPriceIndex}
              onChange={handlePriceRangeChange}
              className="border p-2"
            >
              {priceRanges.map((range, index) => (
                <option key={index} value={index}>
                  ₹{range}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap -m-4">
            {product
              .filter((obj) => obj.title.toLowerCase().includes(searchkey))
              .filter((obj) => obj.category.toLowerCase().includes(filterType))
              .filter((obj) => {
                // Check if discount price is within the selected range
                const discountPrice = parseFloat(obj.discountprice);
                const selectedRange = parseFloat(priceRanges[selectedPriceIndex]);
                return discountPrice <= selectedRange;
              })
              .map((item, index) => {
                const { title, price, imageUrl, id, category, discountprice } = item;
                return (
                  <div
                    key={index}
                    className={`w-full sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/3 p-2  `}
                    onClick={() => (window.location.href = `/productinfo/${id}`)}
                  >
                    <div
                      className={`h-full border-2 shadow-lg transition-shadow duration-300 rounded-xl  ease-in-out border-black-500 border-opacity-60  overflow-hidden ${mode === 'dark' ? 'dark-card' : ''}`}
                    >
                      <div className="flex justify-center cursor-pointer">
                        <img
                          className="w-full h-96 object-cover"
                          src={imageUrl}
                          alt="product"
                        />
                      </div>
                      <div className="p-4">
                        <h2 className={`text-lg font-medium mb-2 ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          {title}
                        </h2>
                        <div className='flex flex-row'>
                          <s className={`text-gray-600 mb-2`}>₹{price}</s>
                          <p className={`text-gray-600 mb-2 ml-2`}>₹{discountprice}</p>
                        </div>
                        <p className={`text-gray-600 mb-2`}>{category}</p>
                        {/* Additional information or actions can be added here */}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default AllProducts;
