/* ============================================
   CASE STUDIES, content for modal
   ============================================ */

window.CASE_STUDIES = {
  sweetvida: {
    eyebrow: 'CASE STUDY 01',
    route: 'INSTAGRAM DMS → REAL SYSTEM',
    title: 'SweetVida',
    sub: 'Designed a full e-commerce and inventory management system for SweetVida, a small online bakery in the DMV area that was running its entire business through Instagram DMs and Venmo. The system centralizes orders, tracks ingredients automatically, and gives the owner real business insights for the first time.',
    role: 'Systems Analyst and Designer',
    timeline: 'Semester project · 2025–2026',
    tools: 'Sublime · Figma · Notion',
    status: 'DESIGNED & BUILT',
    imgSrc: 'sweetvida.png',
    sections: [
      {
        heading: 'The Problem',
        kicker: 'Real demand, no real infrastructure.',
        body: 'SweetVida had real demand but no real infrastructure. Orders came through Instagram stories and direct messages, payments were collected manually through Venmo and Cash App, and inventory was tracked in the owner\'s head. With a production cap of 100 units per night, one missed order or miscounted ingredient could mean lost sales or wasted baking time.'
      },
      {
        heading: 'Results',
        bullets: [
          'Reduced manual order tracking tasks by 50% through a centralized customer portal.',
          'Achieved a 95% target order processing and confirmation success rate.',
          'Eliminated inventory blind spots with real-time stock tracking and automatic low stock alerts.',
          'Gave the owner her first dashboard for sales, ingredient usage, and customer spending trends.'
        ]
      },
      {
        heading: 'Understanding the Business Before Designing the System',
        body: 'We started by mapping every pain point: fragmented communication, unpredictable demand, no inventory visibility, and a heavy reliance on switching between apps manually. From there we defined three user roles with distinct needs: customers who needed a real shopping experience, employees who needed a live order queue, and the owner who needed oversight without complexity. We documented all of this in a Statement of Work that kept the scope tight, staying focused on sales, orders, and inventory while deliberately leaving out HR, social media, delivery logistics, and supplier management.'
      },
      {
        heading: 'Designing the Logic Behind Every Click',
        body: 'We built out logical and physical data flow diagrams at three levels of detail, from the big picture down to individual subprocesses like automated ingredient depletion, loyalty point tracking, and admin authentication. The entity relationship diagram defined eight data entities including Orders, Customers, Menu, Ingredients, and Recipe, and mapped exactly how they connect. The CRUD matrix then confirmed which processes could create, read, update, or delete each piece of data, making sure no process had more access than it needed.'
      },
      {
        heading: 'From Design to a Working Web Platform',
        body: 'The physical design translated every logical decision into real technology. Customer facing pages were built in HTML and PHP with Bootstrap for the front end. All data was handled through SQL operations including INSERT, SELECT, and UPDATE talking to a structured backend database. The automated ingredient depletion feature was a highlight: when an employee marks an order complete, the system automatically calculates which ingredients were used based on the recipe table and updates stock levels without anyone having to do it manually. The owner\'s analytics section pulls from orders, customers, and ingredients to generate live dashboards showing financial records, sales trends, and inventory status.'
      }
    ],
    gallery: [
      { src: 'sweetvida-storefront.png', label: 'Storefront, trending products, live menu' },
      { src: 'sweetvida-about.png', label: 'About page, owner story, brand voice' }
    ],
    links: [
      { label: 'Click to read the full report', href: 'https://drive.google.com/file/d/1xq9fkOHKSv3RrCEdcT_VUD3-uahQV_Pc/view?usp=drive_link' },
      { label: 'Click to view the user manual', href: 'https://drive.google.com/file/d/1HWDDPaqATqVB_GTjxMACnJiarf4ngdIq/view?usp=drive_link' }
    ]
  },

  uberfare: {
    eyebrow: 'CASE STUDY 02',
    route: '58K RIDES → ONE MODEL',
    title: 'Analyzing Uber Fare Prices',
    sub: 'A BMGT431 group study with Michelle Lui, Dario Reyes, and Tonia Agwumezie. We built and compared four predictive models on 58,946 NYC rides from 2013 to 2015, evaluated fairness across rider groups, and segmented rides using K-means clustering.',
    role: 'Data Analyst · Team of 4',
    timeline: 'BMGT431 · 2026',
    tools: 'R · ggplot2 · XGBoost · K-means',
    status: 'PUBLISHED',
    imgSrc: 'uberfare.png',
    sections: [
      {
        heading: 'The Question',
        kicker: 'Can we predict Uber fares from trip characteristics, and which factors matter most?',
        body: 'Uber has over 150 million active monthly users, and a pricing experience nobody fully understands. We cleaned the Kaggle NYC Uber dataset down to 36,746 rides (July 2013 to June 2015) and ran four models against it: Linear Regression, Regression Tree, Random Forest, and XGBoost.'
      },
      {
        heading: 'What the Data Told Us',
        bullets: [
          'Fares are right-skewed: most rides land between $8 and $25, with a long tail of airport and long-distance trips.',
          'Afternoon rides are the most expensive across every day of the week.',
          'Time of day adds only marginal signal beyond distance; the three OLS lines almost overlap.',
          'Passenger count adds basically no predictive value, a business insight worth flagging.'
        ]
      },
      {
        heading: 'Model Comparison',
        kicker: 'XGBoost won, but the gap was tight.',
        body: 'Linear Regression set the floor (RMSE $5.16). The Regression Tree confirmed distance as the #1 split. Random Forest averaged 500 trees to fix variance. XGBoost built trees sequentially, each targeting the last one\'s errors, and edged everything out at RMSE $4.97, MAE $2.82, R² 0.824.'
      },
      {
        heading: 'Fairness & Clustering',
        bullets: [
          'All RMSE ratios fell inside the 0.80 to 1.25 fairness threshold across time of day, ride type, and weekday vs. weekend. No subgroup is being systematically over or undercharged.',
          'K-means surfaced three natural ride types: Long Expensive Airport Rides ($44.80 avg, 8.9 mi, peak 1pm), Medium Commutes ($13.60, 2.3 mi, peak 7am), and Short Cheap Local Trips ($13.30, 2.1 mi, late evening).'
        ]
      },
      {
        heading: 'Final Takeaways',
        bullets: [
          'Distance is the dominant driver, roughly $4.12 per additional mile.',
          'XGBoost was best, but ensemble methods offered diminishing returns past a point.',
          'The three ride clusters could directly inform pricing strategy and targeted promotions.'
        ]
      }
    ],
    gallery: [
      { src: 'Screenshot 2026-05-25 at 2.37.46 PM.png', label: 'Fare vs. distance by time of day' },
      { src: 'Screenshot 2026-05-25 at 2.38.42 PM.png', label: 'Process artifact: visual mapping of model logic' }
    ],
    links: [
      { label: 'Click to read the full report', href: 'https://drive.google.com/file/d/111nxd171hvHE_m1wBlILuIwokHPZwAou/view?usp=drive_link' }
    ]
  },

  techturnup: {
    eyebrow: 'CASE STUDY 03',
    route: 'BUILDING WHERE THEY BELONG',
    title: 'Tech Turn Up, UI/UX Hackathon',
    sub: 'UXTerps Makeathon, Team 16. Tech Turn Up is an after-school program for ages 8 to 16 in technology, robotics, AI, and entrepreneurship. We designed a safe, gamified, community-first online space so that when the room empties out, the momentum doesn\'t.',
    role: 'Product Lead · UX · Research',
    timeline: 'UXTerps Makeathon · 2026',
    tools: 'Figma · FigJam · In-person interviews',
    status: 'PROTOTYPE',
    imgSrc: 'techturnup.png',
    sections: [
      {
        heading: 'The Problem',
        kicker: 'When the session ends, the community disappears.',
        body: 'TTU is small groups, hands-on, community rooted. But when a cycle ends or a student can\'t be in the room, momentum dies. They\'re left with no way to continue, no crew to build with, and no space that feels like theirs. How might we extend the ecosystem online, without replacing it?'
      },
      {
        heading: 'Research, In Person',
        kicker: '8 student voices. 10 staff questions. 100% in-person.',
        body: 'We didn\'t send surveys, we sat with them. 20 targeted questions, not about features but about feelings. About what makes them check out, what makes them come back, what scares them, and what would make them brag to a friend.'
      },
      {
        heading: 'Quotes That Shaped It',
        bullets: [
          '"Will our ideas become real things or are they just ideas?" → TTU Student',
          '"Want words of encouragement like hey king, you\'re doing amazing." → TTU Student',
          '"Centralized everything. I want it embedded." → TTU Staff Member',
          '"How do I know it\'s not an AI? Who\'s watching them? What privacy is there?" → TTU Staff Member'
        ]
      },
      {
        heading: 'Why This Design',
        bullets: [
          'Depth over breadth. One core student journey, fully designed. Every screen ties back to a real interview moment.',
          'Viable MVP. PIN login, Quest steps, Lesson Upload, Group Hub. Buildable today, no AI, no complex backend.',
          'Safety embedded from the start. Staff dashboard pulses red when something is flagged. Cooldown, Audit, Intervene Now, never more than two taps away.',
          'Cultural alignment. The loading screen greets students by name. Every button says Builder, not User. These screens only work for TTU.'
        ]
      }
    ],
    gallery: [
      { src: 'uberfare-models.png', label: 'Lesson logic flow, structured for clarity' },
      { src: 'ttu-chat.png', label: 'Group Hub chat, missions panel, XP tracker' }
    ],
    links: [
      { label: 'Click to view the full slides', href: 'https://drive.google.com/file/d/1rguwaNHC5BiHxwXt4I17AXfqumi6fGHS/view?usp=drive_link' },
      { label: 'Click to open the prototype', href: 'https://drive.google.com/file/d/1_4AHqeFL4dHT0Q7e65vGIzW2rmc5wI-7/view?usp=drive_link' }
    ]
  },

  airaware: {
    eyebrow: 'CASE STUDY 04',
    route: 'CHAOS → CALM',
    title: 'AirAware',
    sub: 'A mobile flight-tracking app that helps travelers feel in control when flights are delayed, changed, or canceled. Instead of scattered updates, AirAware leads with what matters and what to do next.',
    role: 'UI / UX Designer',
    timeline: 'INST 304 · Team 2 · 2025',
    tools: 'Figma · Canva · Usability testing',
    status: 'PROTOTYPE',
    imgSrc: 'airaware.png',
    sections: [
      {
        heading: 'The Problem',
        kicker: '1 in 4 U.S. passengers face a flight disruption each year.',
        body: 'They feel frustrated, out of control, and emotionally strained. Existing airline tools focus on logistics, not the person on the other side of them. Travelers don\'t want more screens. They want clear, timely guidance they can trust.'
      },
      {
        heading: 'What Research Surfaced',
        bullets: [
          'Most travelers only felt somewhat informed during disruptions, a gap in timely, transparent communication.',
          'Dominant emotions: confusion, frustration, powerlessness.',
          'Affinity diagram clustered three themes: missing real-time updates, unclear delay reasons, rebooking anxiety.'
        ]
      },
      {
        heading: 'The Design',
        body: 'A live status tile on the Home screen tells you immediately whether your flight is on time, delayed, or canceled, and what to do next, no digging through menus. Current Flights keeps active and upcoming trips in one place. Flight Options offers focused tools (alternatives, luggage, airport maps, ways to notify others) without overwhelming choice. Widgets and notifications push the critical info to the home screen, so you stay informed without opening the app.'
      },
      {
        heading: 'Reflection',
        body: 'Thoughtful UX can do more than solve problems, it can make people feel confident and in control when plans change.'
      }
    ],
    gallery: [
      { src: 'airaware-screens.png', label: 'Home + Current Flights, the live status tile' },
      { src: 'airaware-widget.png', label: 'Widget and notification, info that finds the traveler' }
    ],
    links: [
      { label: 'Click to view the project site', href: 'https://umcp.my.canva.site/304-team2' }
    ]
  },

  uniranks: {
    eyebrow: 'CASE STUDY 05',
    route: 'QS 2025 → DRIVERS',
    title: 'World University Rankings Analysis',
    sub: 'An in-depth regression analysis using the 2025 QS dataset to uncover what actually drives global university performance. Built and validated a linear regression model in R to quantify the impact of academic reputation, sustainability, employer reputation, faculty-student ratio, and institution size.',
    role: 'Statistical Modeller & Diagnostic Evaluator',
    timeline: 'Top 150 universities · 2025',
    tools: 'R · ggplot2 · Regression diagnostics',
    status: 'PUBLISHED',
    imgSrc: 'uniranks.png',
    sections: [
      {
        heading: 'The Problem',
        kicker: 'Rankings shape institutions, but the drivers behind them stay hidden.',
        body: 'QS rankings shape reputation, attract students, and guide policy, yet the specific factors that most strongly influence a university\'s overall rank are unclear, especially across quantitative measures (academic and employer reputation, sustainability, faculty-student ratio) and categorical factors (institution size, status). This project applies regression analysis in R to identify and validate the key predictors of global university rankings.'
      },
      {
        heading: 'Key Findings',
        bullets: [
          'Academic reputation and employer reputation are the strongest predictors of a university\'s global ranking.',
          'Sustainability also had a significant positive effect on rank.',
          'Faculty-to-student ratio was less impactful than expected.',
          'Institutional size and status had only slight effects, with private and very small or extra-large universities performing marginally better.'
        ]
      },
      {
        heading: 'Implications',
        body: 'Reputation and sustainability are the highest-leverage areas to focus on; faculty ratio and size matter far less than intuition suggests. The model produces ranking predictions with 95% confidence intervals, giving administrators, policymakers, and prospective students a transparent, data-driven way to navigate higher education choices instead of trusting a single magazine-style number.'
      }
    ],
    gallery: [
      { src: 'uniranks-scatter-matrix.png', label: 'Scatterplot matrix of numeric variables' },
      { src: 'uniranks-academic.png', label: 'Academic reputation vs. QS rank, clear negative slope' }
    ],
    links: [
      { label: 'Click to read the full report', href: 'https://drive.google.com/file/d/1nLtDX6ducq9zJalukfYjrq_whTtzkgnG/view' }
    ]
  }
};
