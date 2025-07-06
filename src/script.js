// Get the button:
let mybutton = document.getElementById("top-button");
let scrollingDisabled = false;

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {
  // Don't interfere with scrolling when a section is being shown
  if (scrollingDisabled) {
    // Only prevent scrolling if we're in the quarter buttons state
    const quarterButtons = document.getElementById("quarter-buttons");
    if (quarterButtons && quarterButtons.style.opacity === "1") {
      // Prevent scrolling by maintaining the current position
      window.scrollTo(0, 30);
      return;
    }
  }
  scrollFunction();
  updateButtonColor();
  handleHeroTextTransition();
};

window.onload = function() {
  // Only update time if the element exists
  const timeElement = document.getElementById("time");
  if (timeElement) {
    updateTime();
    setInterval(updateTime, 1000);
  }
  initializeQuarterButtons();
  initializeClickIndicator();
  initializeContactCarousel();
  initializeAboutTabs();
  initializeTypewriter();
};

function updateTime() {
  const timeElement = document.getElementById("time");
  if (timeElement) {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    timeElement.textContent = `${hours}:${minutes}:${seconds}`;
  }
}

function scrollFunction() {
  if (document.body.scrollTop > 60|| document.documentElement.scrollTop > 60) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  // Re-enable scrolling
  scrollingDisabled = false;
  document.body.style.overflow = 'auto';
  
  // Hide quarter buttons
  const quarterButtons = document.getElementById("quarter-buttons");
  if (quarterButtons) {
    quarterButtons.style.opacity = "0";
  }
  
  // Reset hero text position
  const heroText = document.getElementById("hero-text");
  if (heroText) {
    heroText.style.transform = "translateY(0)";
  }
  
  // Show scroll indicator
  const scrollIndicator = document.getElementById("scroll-indicator");
  if (scrollIndicator) {
    scrollIndicator.style.opacity = "1";
  }
  
  // Hide all sections when going back to top
  const allSections = document.querySelectorAll('.section-content');
  allSections.forEach(section => {
    section.classList.add('hidden');
  });
  
  // Hide all main sections
  const mainSections = ['quote', 'contacts', 'about-me'];
  mainSections.forEach(sectionId => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.classList.add('hidden');
    }
  });
  
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

// Handle hero text sliding down and quarter buttons appearing
function handleHeroTextTransition() {
  const heroText = document.getElementById("hero-text");
  const quarterButtons = document.getElementById("quarter-buttons");
  const scrollIndicator = document.getElementById("scroll-indicator");
  const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
  
  // Check if any section is currently visible
  const visibleSections = ['quote', 'contacts', 'about-me'];
  const hasVisibleSection = visibleSections.some(sectionId => {
    const section = document.getElementById(sectionId);
    return section && !section.classList.contains('hidden');
  });
  
  console.log("Scroll position:", scrollPosition); // Debug log
  console.log("Has visible section:", hasVisibleSection); // Debug log
  
  // If we're at the top (scroll position < 30) and there are visible sections, hide them
  if (scrollPosition < 30 && hasVisibleSection) {
    console.log("At top with visible section - hiding sections and resetting"); // Debug log
    // Hide all sections
    visibleSections.forEach(sectionId => {
      const section = document.getElementById(sectionId);
      if (section) {
        section.classList.add('hidden');
      }
    });
    
    // Reset hero text and show scroll indicator
    heroText.style.transform = "translateY(0)";
    quarterButtons.style.opacity = "0";
    if (scrollIndicator) scrollIndicator.style.opacity = "1";
    
    // Re-enable scrolling
    scrollingDisabled = false;
    document.body.style.overflow = 'auto';
    return;
  }
  
  // If a section is visible and we're not at the top, don't interfere
  if (hasVisibleSection && scrollPosition >= 30) {
    return;
  }
  
  // Normal quarter button logic when no sections are visible
  // Trigger animation when user scrolls down 30px
  if (scrollPosition > 30) {
    heroText.style.transform = "translateY(100vh)"; // Slide text down off screen
    quarterButtons.style.opacity = "1"; // Show quarter buttons
    if (scrollIndicator) scrollIndicator.style.opacity = "0"; // Hide scroll indicator
    
    // Disable scrolling when quarter buttons are visible
    scrollingDisabled = true;
    document.body.style.overflow = 'hidden';
    
    console.log("Text hidden, buttons shown, scrolling disabled"); // Debug log
  } else {
    heroText.style.transform = "translateY(0)"; // Reset text position
    quarterButtons.style.opacity = "0"; // Hide quarter buttons completely
    if (scrollIndicator) scrollIndicator.style.opacity = "1"; // Show scroll indicator
    
    // Re-enable scrolling when quarter buttons are hidden
    scrollingDisabled = false;
    document.body.style.overflow = 'auto';
    
    console.log("Text shown, buttons hidden, scrolling enabled"); // Debug log
  }
}

// Initialize quarter button functionality
function initializeQuarterButtons() {
  const quarterButtons = document.querySelectorAll('.quarter-btn');
  console.log("Found quarter buttons:", quarterButtons.length); // Debug log
  
  quarterButtons.forEach((button, index) => {
    const sectionName = button.getAttribute('data-section');
    console.log(`Button ${index}: data-section="${sectionName}"`); // Debug log
    
    button.addEventListener('click', function() {
      const sectionName = this.getAttribute('data-section');
      console.log("Button clicked for section:", sectionName); // Debug log
      if (sectionName) {
        showSection(sectionName);
      }
    });
  });
}

// Initialize click indicator functionality
function initializeClickIndicator() {
  const scrollIndicator = document.getElementById('scroll-indicator');
  if (scrollIndicator) {
    scrollIndicator.addEventListener('click', function() {
      // Simply scroll down to trigger the normal quarter button animation
      // Scroll to about 50px down, which is enough to trigger the handleHeroTextTransition
      window.scrollTo({
        top: 50,
        behavior: 'smooth'
      });
    });
  }
}

// Contact block carousel functionality
let currentContactBlock = 0;
const totalContactBlocks = 3;
let contactCarouselTimeout;

function initializeContactCarousel() {
  const progressDots = document.querySelectorAll('.progress-dot');
  const contactsSection = document.getElementById('contacts');
  const prevButton = document.getElementById('contact-prev');
  const nextButton = document.getElementById('contact-next');
  
  // Add click event listeners to progress dots
  progressDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      showContactBlock(index);
    });
  });
  
  // Add click event listeners to arrow buttons
  if (prevButton) {
    prevButton.addEventListener('click', () => {
      if (currentContactBlock > 0) {
        showContactBlock(currentContactBlock - 1);
      }
    });
  }
  
  if (nextButton) {
    nextButton.addEventListener('click', () => {
      if (currentContactBlock < totalContactBlocks - 1) {
        showContactBlock(currentContactBlock + 1);
      }
    });
  }
  
  // Auto-advance every 5 seconds when section is visible
  if (contactsSection) {
    const startAutoAdvance = () => {
      contactCarouselTimeout = setTimeout(() => {
        if (!contactsSection.classList.contains('hidden')) {
          // Only auto-advance if not at the last block
          if (currentContactBlock < totalContactBlocks - 1) {
            showContactBlock(currentContactBlock + 1);
            startAutoAdvance();
          } else {
            // Reset to first block after reaching the end
            showContactBlock(0);
            startAutoAdvance();
          }
        }
      }, 10000);
    };
    
    // Start auto-advance when contacts section becomes visible
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          if (!contactsSection.classList.contains('hidden')) {
            startAutoAdvance();
          } else {
            clearTimeout(contactCarouselTimeout);
          }
        }
      });
    });
    
    observer.observe(contactsSection, { attributes: true });
  }
  
  // Initialize the first block
  showContactBlock(0);
}

function showContactBlock(blockIndex) {
  const currentBlock = document.getElementById(`contact-block-${currentContactBlock}`);
  const targetBlock = document.getElementById(`contact-block-${blockIndex}`);
  
  if (!targetBlock) return;
  
  // If it's the same block, do nothing
  if (blockIndex === currentContactBlock) return;
  
  // Get the contact container for the flip effect
  const contactContainer = document.querySelector('.contact-blocks-container') || targetBlock.parentElement;
  
  if (currentBlock && currentBlock !== targetBlock) {
    // Add flip-out class to current block
    currentBlock.style.transform = 'rotateY(-90deg)';
    currentBlock.style.opacity = '0';
    
    // After half the animation, hide current and show new block
    setTimeout(() => {
      currentBlock.classList.add('hidden');
      currentBlock.classList.remove('flex');
      currentBlock.style.transform = '';
      currentBlock.style.opacity = '';
      
      // Prepare the new block for flip-in
      targetBlock.classList.remove('hidden');
      targetBlock.classList.add('flex');
      targetBlock.style.transform = 'rotateY(90deg)';
      targetBlock.style.opacity = '0';
      
      // Trigger flip-in animation
      requestAnimationFrame(() => {
        targetBlock.style.transition = 'transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1), opacity 0.3s ease';
        targetBlock.style.transform = 'rotateY(0deg)';
        targetBlock.style.opacity = '1';
        
        // Clean up transition after animation
        setTimeout(() => {
          targetBlock.style.transition = '';
        }, 300);
      });
    }, 150);
    
    // Set transition for the current block
    currentBlock.style.transition = 'transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1), opacity 0.3s ease';
    
  } else {
    // Initial load - just show the block without animation
    const allBlocks = document.querySelectorAll('.contact-block');
    allBlocks.forEach(block => {
      block.classList.add('hidden');
      block.classList.remove('flex');
    });
    
    targetBlock.classList.remove('hidden');
    targetBlock.classList.add('flex');
  }
  
  // Update progress dots - highlight current dot
  const progressDots = document.querySelectorAll('.progress-dot');
  progressDots.forEach((dot, index) => {
    if (index === blockIndex) {
      dot.classList.remove('bg-opacity-30');
      dot.classList.add('bg-white');
    } else {
      dot.classList.add('bg-opacity-30');
      dot.classList.remove('bg-white');
    }
  });
  
  // Update arrow button states
  const prevButton = document.getElementById('contact-prev');
  const nextButton = document.getElementById('contact-next');
  
  if (prevButton) {
    if (blockIndex === 0) {
      // At first block - disable previous button
      prevButton.style.opacity = '0.3';
      prevButton.style.cursor = 'not-allowed';
    } else {
      // Enable previous button
      prevButton.style.opacity = '1';
      prevButton.style.cursor = 'pointer';
    }
  }
  
  if (nextButton) {
    if (blockIndex === totalContactBlocks - 1) {
      // At last block - disable next button
      nextButton.style.opacity = '0.3';
      nextButton.style.cursor = 'not-allowed';
    } else {
      // Enable next button
      nextButton.style.opacity = '1';
      nextButton.style.cursor = 'pointer';
    }
  }
  
  currentContactBlock = blockIndex;
}

// Show selected section below the video
function showSection(sectionName) {
  console.log("Showing section:", sectionName); // Debug log
  
  // Re-enable scrolling when a section is selected
  scrollingDisabled = false;
  document.body.style.overflow = 'auto';
  
  // Hide quarter buttons immediately
  const quarterButtons = document.getElementById("quarter-buttons");
  if (quarterButtons) {
    quarterButtons.style.opacity = "0";
  }
  
  // Hide all main sections first
  const mainSections = ['quote', 'contacts', 'about-me'];
  mainSections.forEach(sectionId => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.classList.add('hidden');
      console.log(`Hiding section: ${sectionId}`);
    }
  });
  
  // Show the selected section
  const targetSection = document.getElementById(sectionName);
  console.log("Target section found:", targetSection); // Debug log
  console.log("Target section classes before:", targetSection ? targetSection.className : "not found");
  
  if (targetSection) {
    targetSection.classList.remove('hidden');
    console.log(`Showing section: ${sectionName}`);
    console.log("Target section classes after:", targetSection.className);
    
    // Force a reflow to ensure the section is rendered
    targetSection.offsetHeight; // This forces a reflow
    
    // Smooth scroll to the section
    setTimeout(() => {
      targetSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  } else {
    console.log("Section not found:", sectionName); // Debug log
  }
}

function updateButtonColor() {
    const sections = [
        {id: "cover", color: "white"},
        {id: "quote", color: "white"},
        {id: "contacts", color: "white"},
        {id: "about-me", color: "white"},
    ];

    const icon = document.getElementById("svg-button");

    for (let section of sections) {
    let element = document.getElementById(section.id);
    let rect = element.getBoundingClientRect();
    
    // Check if the top of the section is within the viewport
    if (rect.top < 800 && rect.bottom > 800) {
      icon.style.fill = section.color;
      break;
    }
  }
}

// Initialize About Me tab functionality
function initializeAboutTabs() {
  const tabs = document.querySelectorAll('.about-tab');
  const tabContents = document.querySelectorAll('.tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTab = tab.getAttribute('data-tab');
      // Remove active state from all tabs
      tabs.forEach(t => {
        t.classList.remove('bg-white', 'text-black');
        t.classList.add('text-white');
      });
      // Add active state to clicked tab
      tab.classList.add('bg-white', 'text-black');
      tab.classList.remove('text-white');
      // Hide all tab contents immediately
      tabContents.forEach(content => {
        content.classList.add('hidden');
        content.style.opacity = '0';
        content.style.transition = '';
      });
      // Show target tab content with fade effect
      const targetContent = document.getElementById(`tab-${targetTab}`);
      if (targetContent) {
        targetContent.classList.remove('hidden');
        targetContent.style.opacity = '0';
        targetContent.style.transition = 'opacity 0.15s ease';
        // Use requestAnimationFrame to ensure the class is removed before opacity is set
        requestAnimationFrame(() => {
          targetContent.style.opacity = '1';
        });
        // Clean up transition after fade-in
        setTimeout(() => {
          targetContent.style.transition = '';
        }, 200);
      }
    });
  });
  // Initialize first tab as active
  const firstTab = document.querySelector('.about-tab[data-tab="personal"]');
  const firstContent = document.getElementById('tab-personal');
  if (firstTab && firstContent) {
    firstTab.classList.add('bg-white', 'text-black');
    firstContent.classList.remove('hidden');
    firstContent.style.opacity = '1';
    firstContent.style.transition = '';
  }
}
