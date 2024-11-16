import { Component } from '@angular/core';

@Component({
  selector: 'app-testimonial-slider',
  templateUrl: './testimonial-slider.component.html',
  styleUrls: ['./testimonial-slider.component.css']
})
export class TestimonialSliderComponent {
  slides = [
    { 
      img: 'https://raw.githubusercontent.com/job4jobless/Images/refs/heads/main/Banners/u23-01.jpg', 
      title: 'John Doe', 
      description: 'This is a testimonial from John Doe.' 
    },
    { 
      img: 'https://raw.githubusercontent.com/job4jobless/Images/refs/heads/main/Banners/u23-01.jpg', 
      title: 'Jane Smith', 
      description: 'Jane Smith provides feedback on our services.' 
    },
    { 
      img: 'https://raw.githubusercontent.com/job4jobless/Images/refs/heads/main/Banners/u23-01.jpg', 
      title: 'John Doe', 
      description: 'This is a testimonial from John Doe.' 
    },
    { 
      img: 'https://raw.githubusercontent.com/job4jobless/Images/refs/heads/main/Banners/u23-01.jpg', 
      title: 'Jane Smith', 
      description: 'Jane Smith provides feedback on our services.' 
    },
    { 
      img: 'https://raw.githubusercontent.com/job4jobless/Images/refs/heads/main/Banners/u23-01.jpg', 
      title: 'John Doe', 
      description: 'This is a testimonial from John Doe.' 
    },
    { 
      img: 'https://raw.githubusercontent.com/job4jobless/Images/refs/heads/main/Banners/u23-01.jpg', 
      title: 'Jane Smith', 
      description: 'Jane Smith provides feedback on our services.' 
    },
    // Add more slides as needed
  ];

  slideConfig = {
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    dots: true,
    infinite: true,
    arrows: true,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };
}

