import { useEffect, useState } from 'react';
import { Button } from "@heroui/react";
import { Construction, ArrowLeft, Hammer, Wrench } from 'lucide-react';

const UnderConstruction = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-full bg-gradient-to-b to-gray-800 flex items-center justify-center p-10 pt-32">
      <div className={`max-w-2xl mx-auto text-center transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <div className="flex justify-center mb-8">
          <div className="relative">
            <Construction 
              size={80} 
              className="text-yellow-400 animate-bounce"
            />
            <Hammer 
              size={24} 
              className="text-blue-400 absolute -top-2 -right-2 animate-spin"
            />
            <Wrench 
              size={24} 
              className="text-green-400 absolute -bottom-2 -left-2 animate-pulse"
            />
          </div>
        </div>


        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
          Under Construction
        </h1>
        
        <div className={`space-y-6 transform transition-all delay-300 duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <p className="text-lg md:text-xl text-gray-300 mb-8">
            We're working hard to bring you something amazing. 
            <br className="hidden md:block" />
            Please check back soon!
          </p>

          
          <div className="w-full max-w-md mx-auto bg-gray-700 rounded-full h-2 mb-8">
            <div className="bg-blue-500 h-2 rounded-full animate-progress"></div>
          </div>

          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-lg mx-auto mb-8">
            {[
              { label: 'Progress', value: '75%' },
              { label: 'Coffee Cups', value: '∞' },
              { label: 'Lines of Code', value: '1337' }
            ].map((stat, index) => (
              <div 
                key={stat.label}
                className={`p-4 bg-gray-800 rounded-lg transform transition-all hover:scale-105 duration-300 delay-${index * 100}`}
              >
                <div className="text-2xl font-bold text-blue-400">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>

          
          <Button
            className="bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            startContent={<ArrowLeft size={18} />}
            onClick={() => window.history.back()}
          >
            Go Back
          </Button>
        </div>
      </div>

      
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-20 w-20 h-20 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-20 h-20 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>
    </div>
  );
};

export default UnderConstruction;