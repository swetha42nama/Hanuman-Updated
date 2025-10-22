import React from "react";
import "./Services.css"; // Optional if you want to style neatly

const services = [
  {
    name: "Arjun",
    img: "/images/arjun.png",
    desc: "High-yield Mirchi variety with medium-size green fruits.",
  },
  {
    name: "1122",
    img: "/images/mahyco.png",
    desc: "Premium Mirchi variety with uniform fruits and good resistance.",
  },
  {
    name: "Red Hot",
    img: "/images/RedHot.png",
    desc: "Popular for its vibrant color and strong spicy flavor.",
  },
  {
    name: "Mahyco",
    img: "/images/mahyco.png",
    desc: "Reliable hybrid known for long shelf life and great productivity.",
  },
  {
    name: "Yeshaswini",
    img: "/images/Yashaswini.png",
    desc: "Preferred by farmers for high pest resistance and uniform fruiting.",
  },
  {
    name: "2222",
    img: "/images/2222.png",
    desc: "Strong hybrid suitable for large-scale cultivation.",
  },
  {
    name: "Armor",
    img: "/images/armor.png",
    desc: "Tough hybrid known for disease resistance and yield stability.",
  },
  {
    name: "855",
    img: "/images/855.png",
    desc: "Consistent performer with excellent fruit shape and taste.",
  },
  {
    name: "Venus",
    img: "/images/venus.png",
    desc: "Affordable variety ideal for small-scale cultivation.",
  },
  {
    name: "Kaveri206",
    img: "/images/2233.png",
    desc: "Medium-cost variety with good market demand.",
  },
  {
    name: "Jamuna116",
    img: "/images/2233.png",
    desc: "Balanced performance with stable yield and growth.",
  },
  {
    name: "Blaze",
    img: "/images/2233.png",
    desc: "Balanced performance with stable yield and growth.",
  },
    {
    name: "Vasundara557",
    img: "/images/mahyco.png",
    desc: "Reliable hybrid known for long shelf life and great productivity.",
  },
    {
    name: "RHS512",
    img: "/images/mahyco.png",
    desc: "Reliable hybrid known for long shelf life and great productivity.",
  },
];

const Services = () => {
  return (
    <div className="services-page">
      <h2>Our Nursery Varieties</h2>
      <p>Explore our high-quality Mirchi sapling varieties and their prices per plant.</p>
      <div className="services-grid">
        {services.map((service, index) => (
          <div key={index} className="service-card">
            <img src={service.img} alt={service.name} className="service-img" />
            <h3>{service.name}</h3>
            <p>{service.desc}</p>
            {/* <p>
              <strong>Cost per Plant:</strong> ₹{service.cost}
            </p> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
