/*
    Project Name: Personal Website + Blog
    Version: 2.0
    Description: A personal website and blog for sololearn
    Author: Benneth Yankey
    Copyright @ 2019 - 2020 - All Rights Reserved
    
    
    ====== Version Control =======
    
    16/12/2018 - project started
    18/12/2018 - added styled component
    21/12/2018 - added react pose
    10/01/2019 - added contentful
    12/01/2019 - added remarkable
    14/01/2019 - added highlightjs
    20/01/2019 - added dark theme
    1/02/2019 -  blog v1.0 launched!    
    1/02/2019  - started writing first post!
    23/03/2019 - updated the blog -> v1.5
    24/006/2020 - updated the blog -> 2.0

*/

//</script><script type="text/babel">

// ==============================================
//                Library Imports
// ==============================================

const contentful = window.contentful;
const Remarkable = window.Remarkable;
const hljs = window.hljs;
const styled = window.styled;
const ReactDOM = window.ReactDOM;
const {
  useState,
  useEffect,
  useLayoutEffect,
  useContext,
  createContext,
  Fragment,
} = React;
const {
  ThemeProvider,
  ThemeContext,
  keyframes,
  createGlobalStyle,
  css,
} = styled;

// ==============================================
//                Global States
// ==============================================

// app context
const AppContext = createContext();

// caches
const cachedEntries = {
  ['active filter']: 'All',
  ['all articles']: null,
};

// articles scroll
const scrollState = {
  position: 0,
};

// light and dark theme
const theme = {
  transparent: 'transparent',
  black: '#000',
  white: '#fff',
  gray: {
    '100': '#f7fafc',
    '200': '#edf2f7',
    '300': '#e2e8f0',
    '400': '#cbd5e0',
    '500': '#a0aec0',
    '600': '#718096',
    '700': '#4a5568',
    '800': '#2d3748',
    '900': '#1a202c',
  },

  blue: {
    '100': '#ebf8ff',
    '200': '#bee3f8',
    '300': '#90cdf4',
    '400': '#63b3ed',
    '500': '#4299e1',
    '600': '#3182ce',
    '700': '#2b6cb0',
    '800': '#2c5282',
    '900': '#2a4365',
  },
  // tags colors
  javascript: '#ffdf7e',
  css: '#81b4fe',
  html: '#ed969e',
  react: '#5a0cfe',
  typescript: '#2d9cdb',
  node: '#8bc34a',
  vue: '#6fcf97',
  git: '#eb5757',
  testing: '#febc85',
  dom: '#86cfda',
  graphql: '#fed1aa',
  ['data structure']: '#b49ddf',
  design: '#af83f8',
  fundamentals: '#80ffb3',
  redux: '#cdde87',
  notes: '#deaa87',
  meta: '#93a7ac',
};

// ==============================================
//                Styled Components
// ==============================================

/**
 * global stylesheet
 *
 * A global stylesheet accessible to all
 * styled components
 */
const GlobalStyles = createGlobalStyle`
@import url('https://fonts.googleapis.com/css2?family=Poppins&family=Open+Sans&display=swap');

  html {
    font-size: 1rem;
    box-sizing: border-box;
    font-family: 'Poppins', sans-serif;
    -webkit-font-smoothing: antialiased;
  }

  *,
  *::before,
  *::after {
    box-sizing: inherit;
  }
  
   * {
     transition: color 0.05s linear;
     transition: background-color 0.05s linear;
   }
  
  body {
    margin: 0;
    padding: 0;
  }

  #root {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: ${({ theme }) => theme.white};
    color: ${({ theme }) => theme.gray['700']};

    ${({ isDark }) =>
      isDark &&
      css`
        background-color: ${({ theme }) => theme.gray['900']};
        color: ${({ theme }) => theme.gray['500']};
      `}
  }

  p {
    margin: 0;
    line-height: 1.7;
  }
`;

const SubTitle = styled.div`
  font-size: 0.85rem;
  font-family: 'Open Sans', sans-serif;
  margin-top: 0.5em;
  color: ${({ theme }) => theme.gray['600']};
  display: flex;
  align-items: center;

  span {
    margin: 0 0.5em;
  }
`;

const LoaderContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.white};

  ${({ isDark }) =>
    isDark &&
    css`
      background-color: ${({ theme }) => theme.gray['900']};
    `}
`;

const rotate = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const Loader = styled.div`
  width: 2em;
  height: 2em;
  border-radius: 50%;
  border: 0.2em solid ${({ theme }) => theme.white};
  border-top-color: ${({ theme }) => theme.gray['900']};
  animation: ${rotate} 1s linear infinite;

  ${({ isDark }) =>
    isDark &&
    css`
      border: 0.2em solid ${({ theme }) => theme.gray['900']};
      border-top-color: ${({ theme }) => theme.white};
    `}
`;

const Anchor = styled.a`
  text-decoration-color: ${({ theme }) => theme.blue['500']};
  color: ${({ theme }) => theme.blue['500']};

  ${({ isNotDecorated }) =>
    isNotDecorated &&
    css`
      text-decoration: none;
    `}

  &:visited {
    color: ${({ theme }) => theme.blue['500']};
  }

  &:hover {
    text-decoration: none;
  }
`;

const Footer = styled.div`
  font-size: 0.7rem;
  padding: 2em 0;
  text-align: center;
  color: ${({ theme }) => theme.gray['600']};
`;

// const ProjectsContainer = styled.div`
//   height: calc(100vh - (50px + 74.78px + 4em));
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   align-items: center;
// `;

const HomeContainer = styled.div`
  padding: 0 1em;
  height: calc(100vh - (50px + 74.78px));
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const MainNavBarContainer = styled.div`
  font-size: 1.25rem;
  width: 100%;
  height: 50px;
  position: fixed;
  top: 0;
  left: 0;
  background-color: ${({ theme }) => theme.white};
  box-shadow: 0 1px ${({ theme }) => theme.gray['300']};
  padding-left: 1em;
  padding-right: 1em;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 100;

  ${({ isDark }) =>
    isDark &&
    css`
      background-color: ${({ theme }) => theme.gray['900']};
      box-shadow: 0 1px ${({ theme }) => theme.gray['700']};
    `}
`;

const LeftPane = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const RightPane = styled(LeftPane)`
  a {
    color: ${({ theme }) => theme.gray['900']};
    border: none;
    cursor: pointer;

    ${({ isDark }) =>
      isDark &&
      css`
        color: ${({ theme }) => theme.gray['400']};
      `}

    &:not(:last-of-type) {
      margin-right: 0.5em;
    }

    &:hover {
      color: ${({ theme }) => theme.blue['500']};
    }
  }
`;

const Brand = styled.div.attrs(({ activateTab, menuOpen, setMenuOpen }) => ({
  onClick: () => {
    if (menuOpen) setMenuOpen(menuOpen => !menuOpen);
    activateTab('home');
  },
}))`
  color: ${({ theme }) => theme.gray['900']};
  letter-spacing: 0.1em;
  cursor: pointer;

  ${({ isDark }) =>
    isDark &&
    css`
      color: ${({ theme }) => theme.gray['400']};
    `}

  ${({ activeTab }) =>
    activeTab === 'home' &&
    css`
      color: ${({ theme }) => theme.blue['500']};
    `}

  &:hover {
    color: ${({ theme }) => theme.blue['500']};
  }
`;

const Hambugger = styled.div`
  width: 25px;
  height: 18px;
  margin-right: 0.5em;
  align-self: center;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  cursor: pointer;

  div {
    border-radius: 0.1em;
    height: 2px;
    background-color: ${({ theme }) => theme.gray['700']};

    ${({ isDark }) =>
      isDark &&
      css`
        background-color: ${({ theme }) => theme.gray['400']};
      `}

    &:nth-child(1) {
      width: 100%;
    }

    &:nth-child(2) {
      width: 60%;
    }

    &:nth-child(3) {
      width: 80%;
    }
  }
`;

const FilterBugger = styled(Hambugger)`
  width: 20px;
  height: 16px;
  align-items: center;
  margin-right: 0.5em;

  div {
    height: 2px;

    &:nth-child(1) {
      width: 100%;
    }

    &:nth-child(2) {
      width: 50%;
    }

    &:nth-child(3) {
      width: 25%;
    }
  }
`;

const HambuggerMenu = styled.div`
  --top: 40px;
  font-size: 1.2rem;
  font-family: 'Open Sans', sans-serif;
  font-weight: bold;
  position: fixed;
  top: var(--top);
  left: 0;
  width: 100%;
  height: calc(100vh - var(--top));
  color: ${({ theme }) => theme.gray['900']};
  background-color: ${({ theme }) => theme.white};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;
  z-index: 100;

  ${({ isDark }) =>
    isDark &&
    css`
      background-color: ${({ theme }) => theme.gray['900']};
      color: ${({ theme }) => theme.gray['400']};
    `}

  .nav-items {
    grid-area: middle;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    justify-content: center;

    div + div {
      margin-top: 1em;
    }

    div {
      &:hover {
        cursor: pointer;
        color: ${({ theme }) => theme.blue['500']};
      }
    }
  }
`;

const FilterMenu = styled.div`
  position: relative;
  background-color: ${({ theme }) => theme.white};
  border: 1px solid ${({ theme }) => theme.gray['700']};
  width: calc(100% - 2em);
  padding: 1em;
  border-radius: 0.2em;
  position: fixed;
  top: 150px;
  right: 1em;
  display: flex;
  flex-wrap: wrap;
  flex-flow: 0 0 auto;
  justify-content: center;
  z-index: 99;

  ${({ isDark }) =>
    isDark &&
    css`
      background-color: ${({ theme }) => theme.gray['800']};
    `}

  @media (min-width: 768px) {
    width: 350px;
  }

  &::after {
    content: '';
    position: absolute;
    top: -8px;
    right: 18px;
    width: 15px;
    height: 15px;
    background-color: inherit;
    transform: rotate(45deg);
    border: 1px solid ${({ theme }) => theme.gray['700']};
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 14px;
    width: 30px;
    height: 10px;
    background-color: inherit;
    z-index: 100;
  }

  p {
    border: 1.25px solid ${({ theme }) => theme.gray['700']};
    padding-left: 0.3em;
    padding-right: 0.3em;
    margin-right: 0.5em;
    margin-bottom: 0.5em;
    cursor: pointer;

    ${({ isDark }) =>
      isDark &&
      css`
        border-color: ${({ theme }) => theme.gray['600']};
      `}

    &:hover {
      color: ${({ theme }) => theme.white};
      background-color: ${({ theme }) => theme.blue['500']};
      border-color: ${({ theme }) => theme.blue['500']};
    }
  }
`;

const Header = styled.h2`
  font-size: 1.3rem;
  font-family: 'Open Sans', sans-serif;
  text-align: center;
  letter-spacing: 0.03em;
  margin-bottom: 0;
  margin-top: 0.3em;
  color: ${({ theme }) => theme.gray['800']};

  ${({ isDark }) =>
    isDark &&
    css`
      color: ${({ theme }) => theme.gray['400']};
    `}
`;

const ContactContainer = styled.div`
  background-color: ${({ theme }) => theme.white};
  height: 100vh;
  padding-top: 1em;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-areas: 'top' 'bottom';

  ${({ isDark }) =>
    isDark &&
    css`
      background-color: ${({ theme }) => theme.gray['900']};
    `}
`;

const MarkdownContent = styled.div`
  margin-top: 3em;

  p,
  ul,
  ol,
  li::before {
    padding-left: 1em;
    padding-right: 1em;
  }

  p + p {
    margin-top: 1em;
  }

  ul,
  ol {
    margin-left: 2em;
    line-height: 1.7;
  }

  h1 {
    color: ${({ theme }) => theme.gray['900']};

    ${({ isDark }) =>
      isDark &&
      css`
        color: ${({ theme }) => theme.white};
      `}
  }

  h2,
  h3,
  h4 {
    padding-left: 0.7em;
    padding-right: 0.7em;
  }

  h2 {
    font-size: 1.4rem;
  }

  h3 {
    font-size: 1.2rem;
  }

  h2,
  h3 {
    font-family: 'Open Sans', sans-serif;
    margin-top: 2em;
    color: ${({ theme }) => theme.gray['800']};
    letter-spacing: 0.08em;
    text-transform: capitalize;
    position: relative;

    ${({ isDark }) =>
      isDark &&
      css`
        color: ${({ theme }) => theme.gray['300']};
      `}
  }

  h2 + h3 {
    margin-top: 0.5em;
  }

  pre {
    padding: 2em;
    overflow-x: auto;
    line-height: 1.3;
    color: ${({ theme }) => theme.white};
    background-color: ${({ theme }) => theme.gray['800']};

    code {
      font-size: 0.9rem;
    }
  }

  mark {
    padding: 0 0.2em;
    background-color: ${({ theme }) => theme.gray['200']};
    color: ${({ theme }) => theme.gray['900']};

    ${({ isDark }) =>
      isDark &&
      css`
        background-color: ${({ theme }) => theme.gray['800']};
        color: ${({ theme }) => theme.gray['500']};
      `}
  }

  #post-img {
    margin: 3em 1em;

    img {
      width: 100%;
      max-height: 380px;
      object-position: center;
      object-fit: contain;
    }
  }

  #post-img-title {
    position: relative;
    top: -2.2em;
  }
`;

const PostNavBarContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 50px;
  padding: 0 1em;
  background-color: ${({ theme }) => theme.white};
  box-shadow: 0 1px ${({ theme }) => theme.gray['300']};
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 10;

  ${({ isDark }) =>
    isDark &&
    css`
      background-color: ${({ theme }) => theme.gray['900']};
      box-shadow: 0 1px ${({ theme }) => theme.gray['700']};
    `}

  ${({ contactActive }) =>
    contactActive &&
    css`
      background-color: transparent;
      box-shadow: none;
    `}

  span {
    font-size: 2rem;
    cursor: pointer;
    &:hover {
      color: ${({ theme }) => theme.blue['500']};
    }
  }
`;

const PostPagination = styled.div`
  padding: 0 1em;
  margin-top: 5em;
  display: flex;
  justify-content: center;

  span {
    border: 1px solid ${({ theme }) => theme.gray['700']};
    padding: 0.2em 0.4em;
    text-align: center;
    cursor: pointer;

    ${({ isDark }) =>
      isDark &&
      css`
        border-color: ${({ theme }) => theme.blue['500']};
        color: ${({ theme }) => theme.blue['500']};
      `}

    &:hover {
      border-color: ${({ theme }) => theme.blue['500']};
      background-color: ${({ theme }) => theme.blue['500']};
      color: ${({ theme }) => theme.white};
    }

    &:first-of-type {
      border-right: none;
    }
  }
`;

const ArticleTag = styled.div`
  font-size: 0.8rem;
  background-color: ${({ theme, tag }) => theme[tag]};
  color: ${({ theme }) => theme.gray['800']};
  display: inline-block;
  padding: 0.2em 0.4em;
  border-radius: 0.15em;

  &:not(:last-of-type) {
    margin-right: 0.8em;
  }
`;

const ArticlesContainer = styled.section`
  margin-bottom: 2em;
  margin-top: 2em;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto;

  .article-wrapper {
    padding: 0 1em;
    min-height: 30px;
    display: flex;
    flex-direction: column;

    .pub_summary {
      margin-top: 1.4em;
    }

    .pub_details {
      font-size: 0.9rem;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      margin-top: 1em;
      text-align: right;
      color: ${({ theme }) => theme.gray['600']};

      div {
        display: flex;
        align-items: center;
        cursor: pointer;

        &:hover {
          color: ${({ theme }) => theme.blue['700']};

          ${({ isDark }) =>
            isDark &&
            css`
              color: ${({ theme }) => theme.white};
            `}
        }

        div:first-of-type {
          margin-right: 0.4em;
        }
      }
    }

    h2 {
      margin: 0;
    }
  }
`;

const ArticlesFilter = styled.div.attrs(({ setOpenFilterMenu }) => ({
  onClick: () => setOpenFilterMenu(openFilter => !openFilter),
}))`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.2rem;
  padding: 1em 1em 0.5em;
  padding-top: 3em;
  background-color: ${({ theme }) => theme.white};
  color: ${({ theme }) => theme.gray['800']};
  width: 100%;
  position: fixed;
  top: 47px;
  z-index: 99;

  ${({ isDark }) =>
    isDark &&
    css`
      background-color: ${({ theme }) => theme.gray['900']};
      color: ${({ theme }) => theme.gray['500']};
    `}

  span:first-of-type {
    color: ${({ theme, isDark }) =>
      isDark ? theme.gray['700'] : theme.gray['500']};
  }

  span:last-of-type {
    color: ${({ theme, isDark }) => (isDark ? theme.gray['400'] : 'inherit')};
  }
`;

const ArticlesDivider = styled.div`
  height: 2.5px;
  background-color: ${({ theme }) => theme.gray['300']};
  margin: 1em 0;

  ${({ isDark }) =>
    isDark &&
    css`
      background-color: ${({ theme }) => theme.gray['700']};
    `}

  &:last-of-type {
    display: none;
  }
`;

const ContactTop = styled.section`
  grid-area: top;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;

  .img-border-style {
    width: 8em;
    height: 8em;
    border: 3px solid ${({ theme }) => theme.gray['700']};
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const ProfilePic = styled.img.attrs(props => ({
  src: `https:${props.pic}`,
}))`
  width: 7em;
  height: 7em;
  border-radius: 50%;
`;

const ContactBottom = styled.section`
  grid-area: bottom;
  background-color: ${({ theme }) => theme.gray['200']};
  padding: 1.5em 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  ${({ isDark }) =>
    isDark &&
    css`
      background-color: ${({ theme }) => theme.gray['800']};
    `}

  .title {
    text-align: center;

    p {
      padding: 0.5em 1em;
    }
  }
`;

const SocialContact = styled.section`
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 0 1em;

  a + a {
    margin-left: 0.3em;
  }

  .facebook,
  .twitter,
  .whatsapp,
  .instagram {
    height: 80px;
    width: 70px;
    font-size: 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
  }

  /* sm: small screen */
  @media (max-width: 320px) {
    .facebook,
    .twitter,
    .whatsapp,
    .instagram {
      width: 60px;
      height: 60px;
    }
  }

  .facebook {
    background-color: #3c5a99;
  }

  .twitter {
    background-color: #1da1f2;
  }

  .instagram {
    background: linear-gradient(
      to right,
      hsl(37, 97%, 70%),
      hsl(329, 70%, 58%)
    );
  }

  .whatsapp {
    background-color: #00e676;
  }
`;

const ViewAllButton = styled.div.attrs(({ activateTab }) => ({
  onClick: () => {
    scrollState.position = 0;
    activateTab('all-articles');
  },
}))`
  border: 1px solid ${({ theme }) => theme.gray['700']};
  padding: 0.1em 0.4em;
  letter-spacing: 0.025em;
  cursor: pointer;

  ${({ isDark }) =>
    isDark &&
    css`
      border-color: ${({ theme }) => theme.blue['500']};
      color: ${({ theme }) => theme.blue['500']};
    `}

  &:hover {
    border-color: ${({ theme }) => theme.blue['500']};
    background-color: ${({ theme }) => theme.blue['500']};
    color: ${({ theme }) => theme.white};
  }
`;

const PortfolioWrapper = styled.div`
  padding-left: 1em;
  padding-right: 1em;

  h1,
  h2,
  h4,
  h5,
  h6 {
    margin: 0;
  }

  h3 {
    color: ${({ theme }) => theme.gray['800']};

    ${({ isDark }) =>
      isDark &&
      css`
        color: ${({ theme }) => theme.gray['400']};
      `}
  }

  h4 {
    color: ${({ theme }) => theme.gray['700']};

    ${({ isDark }) =>
      isDark &&
      css`
        color: ${({ theme }) => theme.gray['500']};
      `}
  }

  .content-platform {
    color: ${({ theme }) => theme.gray['600']};

    ${({ isDark }) =>
      isDark &&
      css`
        color: ${({ theme }) => theme.gray['600']};
      `}
  }
`;

// ==============================================
//                React Hooks
// ==============================================

/**
 * markdown renderer
 *
 * it renders string to markdown
 *
 * @param {string} props
 * @returns string
 */
function useMarkdown(props) {
  const md = new Remarkable({
    html: true,
    highlight: function (str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(lang, str).value;
        } catch (err) {}
      }

      try {
        return hljs.highlightAuto(str).value;
      } catch (err) {}

      return '';
    },
  });

  md.inline.ruler.enable(['footnote_inline', 'ins', 'mark', 'sub', 'sup']);
  return md.render(props);
}

/**
 * date formatter
 *
 * @param {object} post
 * @returns string tuple
 */
function useFormatDate(post) {
  const fDate = new Date(`${post.published}`);
  const month = fDate.getMonth(),
    year = fDate.getFullYear(),
    date = fDate.getDate();

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const m = months.filter((_, i) => i === month)[0];

  const dateOrdinal = date => {
    const last = String(date).split('').slice(-1)[0];
    switch (last) {
      case '1':
        return `${date}st`;
      case '2':
        return `${date}nd`;
      case '3':
        return `${date}rd`;
      case '11':
      case '12':
      case '13':
        return `${date}th`;
      default:
        return `${date}th`;
    }
  };

  const formattedDate = `${m} ${dateOrdinal(date)}, ${year}`;
  const acceptedDateFormat = `${year}-${month}-${date}`;
  return [formattedDate, acceptedDateFormat];
}

/**
 * @returns page scroll offset
 */
function usePageYOffset() {
  const [pageYOffset, setPageYOffset] = useState(0);

  const handlePageYOffset = () => {
    setPageYOffset(window.pageYOffset);
  };

  useEffect(() => {
    window.addEventListener('scroll', handlePageYOffset);
    return () => window.removeEventListener('scroll', handlePageYOffset);
  }, [pageYOffset]);

  return pageYOffset;
}

/**
 * @returns page width
 */
function usePageWidth() {
  const [pageWidth, setPageWidth] = useState(window.innerWidth);

  const handlePageWidth = () => {
    setPageWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener('resize', handlePageWidth);
    return () => window.removeEventListener('resize', handlePageWidth);
  }, [pageWidth]);

  return pageWidth;
}

// ==============================================
//                React Components
// ==============================================

/**
 * renders non-mobile screen contents
 */
function NonMobilePage() {
  const theme = useContext(ThemeContext);

  // hide loader
  document.querySelector('.loader').style.display = 'none';

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '1.1rem',
      }}
    >
      <h1>Oops!</h1>
      <p>
        <span style={{ color: theme.blue['500'] }}>Bad News</span>: Browser
        width is wider than small screens: mobile & tablet
      </p>
      <p>
        <span style={{ color: theme.blue['500'] }}>Good News</span>: Resize the
        browser to view the app
      </p>
    </div>
  );
}

/**
 * renders post navigation bar
 */
function PostNavBar({
  contactActive,
  activateContact,
  setPostActive,
  activateTab,
}) {
  const { isDark } = useContext(AppContext);

  const closePostContent = () => {
    if (contactActive) {
      activateTab(cachedEntries['prev activeTab']);
      activateContact();
      return;
    }
    setPostActive(false);
  };

  return (
    <PostNavBarContainer isDark={isDark} contactActive={contactActive}>
      <span onClick={() => closePostContent()}>
        <i className="fa fa-angle-left"></i>
      </span>
    </PostNavBarContainer>
  );
}

/**
 * renders main navigation bar
 */
function MainNavBar({ activeTab, activateTab, activateContact, lightMode }) {
  const { isDark } = useContext(AppContext);
  const theme = useContext(ThemeContext);
  const navItems = ['blog', 'about', 'resume', 'contact'];
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuClick = nav => {
    cachedEntries['active filter'] = 'All';
    if (nav === 'contact') {
      cachedEntries['prev activeTab'] = activeTab;
      activateContact();
      setMenuOpen(false);
      return;
    }
    activateTab(nav);
    setMenuOpen(false);
  };

  return (
    <Fragment>
      <MainNavBarContainer isDark={isDark} menuOpen={menuOpen}>
        <LeftPane>
          <Hambugger
            isDark={isDark}
            onClick={() => {
              setMenuOpen(menuOpen => !menuOpen);
              cachedEntries['navMenuOpen'] = menuOpen;
            }}
          >
            <div></div>
            <div></div>
            <div></div>
          </Hambugger>
          <Brand
            isDark={isDark}
            activeTab={activeTab}
            activateTab={activateTab}
            menuOpen={menuOpen}
            setMenuOpen={setMenuOpen}
          >
            B3N
          </Brand>
        </LeftPane>
        <RightPane isDark={isDark}>
          <a onClick={() => lightMode()} href="#">
            <i
              className="fa fa-moon-o"
              style={{ color: isDark ? theme.blue['500'] : 'gold' }}
            ></i>
          </a>
          <a href="https://twitter.com/benbright1">
            <i className="fa fa-twitter"></i>
          </a>
          <a href="https://github.com/iambenbright?tab=repositories">
            <i className="fa fa-github"></i>
          </a>
        </RightPane>
      </MainNavBarContainer>
      {menuOpen && (
        <HambuggerMenu menuOpen={menuOpen} isDark={isDark}>
          <div className="nav-items">
            {navItems.map((nav, i) => {
              return (
                <div
                  key={i}
                  style={{
                    paddingBottom: '0.3em',
                    color: `${activeTab === nav ? theme.blue['500'] : ''}`,
                    borderBottom: `${
                      activeTab === nav ? `3px solid ${theme.blue['500']}` : ''
                    }`,
                  }}
                  onClick={() => handleMenuClick(nav)}
                >
                  {nav}
                </div>
              );
            })}
          </div>
        </HambuggerMenu>
      )}
    </Fragment>
  );
}

/**
 * render home page
 */
function Home({ activateTab }) {
  const { isDark } = useContext(AppContext);

  return (
    <HomeContainer>
      <p style={{ fontSize: '1.5rem', fontFamily: 'Open Sans sans-serif' }}>
        Hello, I'm
      </p>
      <Title
        style={{
          fontSize: '2rem',
          textAlign: 'left',
          letterSpacing: '0.05em',
          marginTop: '0.25em',
        }}
      >
        BENNETH YANKEY
      </Title>
      <p
        style={{
          fontSize: '1.1rem',
          color: isDark ? theme.gray['500'] : theme.gray['700'],
        }}
      >
        Software Engineer / Web Developer
      </p>
      <p style={{ marginTop: '2em' }}>
        I created this site to share and document eveything I have learned and
        learning with you and the world!.
      </p>
      <br />
      <p onClick={() => activateTab('about')}>
        <Link>Like to know more about me?</Link>
      </p>
    </HomeContainer>
  );
}

/**
 * renders about page
 */
function About({ activateContact, activeTab }) {
  return (
    <Fragment>
      <Title style={{ margin: '2em 0' }}>About me</Title>
      <div style={{ padding: '0 1em' }}>
        <p>
          I am Benneth Yankey, a fullstack engineer or web developer, content
          creator and high school biology teacher from Ghana, Africa.
        </p>
        <br />
        <p>
          I have quite experience in software development and an open-source
          contributor. My language of choice is JavaScript (frontend & backend),
          but mostly work at the frontend.
        </p>
        <br />
        <p>
          I am very enthusiastic and passionate about my work, time conscious
          and work all heart out with clients to deliver products.
        </p>
        <br />
        <p>
          I am open to collaborations and love to learn and work with all
          developers at any level. <br />
          <br /> Like to hire or work with me on a project? <br />
          <span
            onClick={() => {
              cachedEntries['prev activeTab'] = activeTab;
              activateContact();
            }}
          >
            <Link>Let's get in touch</Link>
          </span>
        </p>
      </div>
    </Fragment>
  );
}

/**
 * renders contact page
 */
function ContactContent() {
  const { isDark } = useContext(AppContext);
  const theme = useContext(ThemeContext);
  const [profilePic, setProfilePic] = useState(null);

  const wLink = `https://wa.me/233500083455/?text=${encodeURI(
    'Hi, Ben here!'
  )}`;

  useEffect(() => {
    if (cachedEntries['profile pic']) {
      setProfilePic(cachedEntries['profile pic']);
    } else {
      fetchProfilePic();
    }
  }, []);

  const fetchProfilePic = async () => {
    try {
      const asset = await client.getAsset('2dmBvE3pqzChaplVyTqdtw');
      let pic = asset.fields.file.url;
      setProfilePic(pic);
      cachedEntries['profile pic'] = pic;
    } catch (e) {
      console.log(e);
    }
  };

  if (profilePic) {
    return (
      <ContactContainer isDark={isDark}>
        <ContactTop>
          <div className="img-border-style">
            <ProfilePic pic={profilePic} isDark={isDark} />
          </div>
          <Title style={{ marginTop: '1em' }}>BENNETH YANKEY</Title>
          <p>Software Engineer / Web Developer</p>
        </ContactTop>
        <ContactBottom isDark={isDark}>
          <div className="title">
            <Title
              style={{
                padding: '0 1em',
              }}
            >
              I LOVE TO MEET NEW PEOPLE
            </Title>
            <p>
              Let's get in touch.
              <Link
                href="https://www.linkedin.com/in/benneth-yankey-23201232"
                target="_blank"
              >
                {' '}
                Linkedin
              </Link>
              ,{' '}
              <Link href="https://twitter.com/benbright1" target="_blank">
                Twitter
              </Link>
              ,{' '}
              <Link href="https://instagram.com/iambenbright" target="_blank">
                Instagram
              </Link>
              , and{' '}
              <Link href={`${wLink}`} target="_blank">
                WhatsApp
              </Link>{' '}
              work best.
            </p>
          </div>
          <div
            style={{
              width: '100px',
              height: '2px',
              backgroundColor: theme.gray['500'],
            }}
          ></div>
          <SocialContact>
            <Link
              isNotDecorated={true}
              href="https://www.linkedin.com/in/benneth-yankey-23201232"
              target="_blank"
              className="facebook"
            >
              <i className="fa fa-linkedin"></i>
            </Link>
            <Link
              isNotDecorated={true}
              href="https://twitter.com/benbright1"
              target="_blank"
              className="twitter"
            >
              <i className="fa fa-twitter"></i>
            </Link>
            <Link
              isNotDecorated={true}
              href="https://instagram.com/iambenbright"
              target="_blank"
              className="instagram"
            >
              <i className="fa fa-instagram"></i>
            </Link>
            <Link
              isNotDecorated={true}
              href={`${wLink}`}
              target="_blank"
              className="whatsapp"
            >
              <i className="fa fa-whatsapp"></i>
            </Link>
          </SocialContact>
        </ContactBottom>
      </ContactContainer>
    );
  } else {
    return <SpinLoader />;
  }
}

/**
 * renders all articles page
 */
function AllArticles({ postDetail }) {
  const theme = useContext(ThemeContext);
  const { isDark } = useContext(AppContext);
  const [sortedEntries, setSortedEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const pageYOffset = usePageYOffset();

  /** cache entries after initial render */
  useEffect(() => {
    if (cachedEntries['sorted entries']) {
      setSortedEntries(cachedEntries['sorted entries']);
      window.scrollTo(0, scrollState.position);
      return;
    }
    fetchAllEntries();
  }, []);

  /** run effect if filtered entries change */
  useEffect(() => {
    if (cachedEntries['filtered entries']) {
      setFilteredEntries(cachedEntries['filtered entries']);
    }
  }, [cachedEntries['filtered entries']]);

  const fetchAllEntries = async () => {
    let source = [];
    try {
      const entries = await client.getEntries({
        content_type: 'blogPost',
        order: '-fields.published',
      });
      entries.items.forEach(entry => source.push(entry.fields));
      sortEntriesByYear(source);
    } catch (e) {
      console.log(e);
    }
  };

  /** sort entries by year */
  const sortEntriesByYear = allEntries => {
    // cached raw entries
    cachedEntries['all articles'] = allEntries;
    const sortedEntries = allEntries.reduce((accum, curr) => {
      const pubYear = new Date(curr.published).getFullYear();
      if (!accum[pubYear]) {
        accum[pubYear] = [];
        accum[pubYear].push(curr);
      } else {
        accum[pubYear].push(curr);
      }
      return accum;
    }, {});
    const sortedEntriesDesc = Object.entries(sortedEntries).reverse();
    setSortedEntries(sortedEntriesDesc);
    // cache sorted entries
    cachedEntries['sorted entries'] = sortedEntriesDesc;
  };

  // filter entries by tag
  const handleFilter = () => {
    const filteredArticles = sortedEntries.map(entry => {
      const output = entry[1].filter(data => {
        return data['tags'].some(
          tag =>
            tag.toLowerCase() === cachedEntries['active filter'].toLowerCase()
        );
      });
      /** only non-empty output */
      if (output.length) return [entry[0], output];
    });

    const f = filteredArticles.filter(article => Boolean(article));
    setFilteredEntries(f);
    /** cached filtered entries */
    cachedEntries['filtered entries'] = f;
  };

  /** renders all and filtered articles */
  const renderArticles = data => {
    return data.length ? (
      data.map(item => {
        return (
          <FilteredArticles
            key={item[0]}
            data={item}
            postDetail={postDetail}
            pageYOffset={pageYOffset}
          />
        );
      })
    ) : (
      <div
        style={{
          textAlign: 'center',
          paddingTop: '80px',
        }}
      >
        <div>
          <i
            className="fa fa-try"
            style={{
              fontSize: '4rem',
              color: isDark ? theme.gray['700'] : theme.gray['300'],
            }}
          ></i>
        </div>
        <p style={{ marginTop: '1em' }}>Oh Snap!</p>
        <p>contents coming soon</p>
      </div>
    );
  };

  return sortedEntries.length ? (
    <Fragment>
      <ArticlesFilterMenu handleFilter={handleFilter} />
      <div style={{ marginTop: '5em' }}>
        {cachedEntries['active filter'] === 'All'
          ? renderArticles(sortedEntries)
          : renderArticles(filteredEntries)}
      </div>
    </Fragment>
  ) : (
    <SpinLoader />
  );
}

/**
 * renders articles filter menu
 */
function ArticlesFilterMenu({ handleFilter }) {
  const { isDark } = useContext(AppContext);
  const theme = useContext(ThemeContext);
  const [openFilterMenu, setOpenFilterMenu] = useState(false);

  const filters = [
    'All',
    'React',
    'Node',
    'Vue',
    'Javascript',
    'Git',
    'GraphQL',
    'Css',
    'Typescript',
    'Testing',
  ];

  return (
    <div style={{ position: 'relative' }}>
      <ArticlesFilter isDark={isDark} setOpenFilterMenu={setOpenFilterMenu}>
        <p style={{ marginRight: '1em' }}>
          Articles <span>/</span> <span>{cachedEntries['active filter']}</span>
        </p>
        <div style={{ display: 'flex' }}>
          <FilterBugger isDark={isDark}>
            <div></div>
            <div></div>
            <div></div>
          </FilterBugger>
          <p>Filter</p>
        </div>
      </ArticlesFilter>
      {openFilterMenu && (
        <FilterMenu isDark={isDark}>
          {filters.map((filter, idx) => (
            <p
              key={idx}
              onClick={() => {
                if (filter === cachedEntries['active filter']) return;
                cachedEntries['active filter'] = filter;
                handleFilter();
                setOpenFilterMenu(!openFilterMenu);
              }}
              style={{
                color: cachedEntries['active filter'] === filter && theme.white,
                backgroundColor:
                  cachedEntries['active filter'] === filter &&
                  theme.blue['500'],
                borderColor:
                  cachedEntries['active filter'] === filter &&
                  theme.blue['500'],
              }}
            >
              {filter}
            </p>
          ))}
        </FilterMenu>
      )}
    </div>
  );
}

/**
 * renders filtered articles
 */
function FilteredArticles({ data, postDetail, pageYOffset }) {
  return (
    <Fragment>
      <div style={{ padding: '0 1em' }}>
        <Title
          style={{ textAlign: 'left', marginBottom: '1em', marginTop: '2em' }}
        >
          {data[0]}
        </Title>
        {data[1].map(entry => {
          return (
            <div
              key={entry.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '16px 1fr',
                gridTemplateRows: 'auto',
                columnGap: '1em',
                alignItems: 'flex-start',
                marginBottom: '0.5em',
              }}
            >
              <div
                style={{
                  width: 16,
                  height: 16,
                  position: 'relative',
                  top: '0.2em',
                }}
              >
                <img
                  style={{
                    width: '100%',
                    height: '100%',
                    maxHeight: '100%',
                    objectPosition: 'center',
                    objectFit: 'contain',
                  }}
                  src={`https:${entry.logo.fields.file.url}`}
                  alt={entry.logo.fields.file.fileName}
                />
              </div>
              <p
                style={{ cursor: 'pointer', lineHeight: '1.5' }}
                onClick={() => {
                  scrollState.position = pageYOffset;
                  postDetail(entry);
                }}
              >
                {entry.title}
              </p>
            </div>
          );
        })}
      </div>
      <Divider />
    </Fragment>
  );
}

/**
 * renders single article
 */
function Article({ post, postDetail, pageYOffset }) {
  const [formattedDate, rawDate] = useFormatDate(post);

  function addEllipsis(summary) {
    summary = summary.split(' ');
    if (summary.length > 20) {
      return summary.slice(0, 25).join(' ') + ' ' + '. . .';
    }
    return summary.join(' ');
  }

  return (
    <div className="article-wrapper">
      <Title style={{ textAlign: 'left' }}>{post.title}</Title>
      <SubTitle>
        <time datetime={rawDate}>{formattedDate}</time>
      </SubTitle>
      <p className="pub_summary">{addEllipsis(post.summary)}</p>
      <div className="pub_details">
        <div
          onClick={() => {
            scrollState.position = pageYOffset;
            postDetail(post);
          }}
        >
          <div>Read More . . .</div>
        </div>
      </div>
    </div>
  );
}

/**
 * loader component
 */
function SpinLoader() {
  const { isDark } = useContext(AppContext);
  return (
    <LoaderContainer isDark={isDark}>
      <Loader isDark={isDark} />
    </LoaderContainer>
  );
}

/**
 * articles separator
 */
function Divider() {
  const { isDark } = useContext(AppContext);
  return <ArticlesDivider isDark={isDark} />;
}

/**
 * wraps page header
 */
function Title({ children, ...props }) {
  const { isDark } = useContext(AppContext);
  return (
    <Header isDark={isDark} {...props}>
      {children}
    </Header>
  );
}

/**
 * wraps anchor tags
 */
function Link({ children, ...props }) {
  return (
    <Anchor href="#" {...props}>
      {children}
    </Anchor>
  );
}

/**
 * renders all articles
 */
function Articles({ activateTab, postDetail }) {
  const { store, isDark } = useContext(AppContext);
  const pageYOffset = usePageYOffset();

  useLayoutEffect(() => {
    window.scrollTo(0, pageYOffset);
  });

  return (
    <Fragment>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '3em',
          padding: '0 1em',
        }}
      >
        <div style={{ fontSize: '1.4rem' }}>Latest</div>
        <ViewAllButton activateTab={activateTab} isDark={isDark}>
          View All
        </ViewAllButton>
      </div>
      <ArticlesContainer isDark={isDark}>
        {store.map((post, idx) => {
          return (
            <Fragment key={idx}>
              <Article
                key={post.id}
                postDetail={postDetail}
                post={post}
                pageYOffset={pageYOffset}
              />
              <Divider />
            </Fragment>
          );
        })}
      </ArticlesContainer>
    </Fragment>
  );
}

/**
 * wraps portfolio contents or sections
 */
function PortfolioContent({ children, ...props }) {
  const { isDark } = useContext(AppContext);
  return (
    <PortfolioWrapper isDark={isDark} {...props}>
      {children}
    </PortfolioWrapper>
  );
}

/**
 * renders resume page
 */
function Resume() {
  return (
    <Fragment>
      <Title style={{ marginBottom: '1em', marginTop: '2em' }}>Resume</Title>
      <PortfolioContent>
        <h3>Work Experience</h3>
        <h4>Content Creator</h4>
        <div className="content-platform">
          <span>Instagram </span> &middot;
          <span> 2020 &ndash; current </span>
        </div>
        <ul>
          <li>
            I create concise code snippets, tips and tricks in javascript and
            more
          </li>
        </ul>
      </PortfolioContent>
      <Divider />
      <PortfolioContent>
        <h3>Technical Skills</h3>
        <h4>Proficient in:</h4>
        <ul style={{ columns: '2 auto' }}>
          <li>JavaScript</li>
          <li>React</li>
          <li>HTML</li>
          <li>CSS</li>
          <li>Styled-Component</li>
        </ul>
        <h4>Experienced with:</h4>
        <ul style={{ columns: '2 auto', columGap: '10em' }}>
          <li>SQL</li>
          <li>Node</li>
          <li>Git & Github</li>
          <li>Bootstrap</li>
          <li>Tailwind</li>
          <li>Postgres</li>
          <li>SQLite</li>
          <li>SASS</li>
        </ul>
        <h4>Familiar with:</h4>
        <ul style={{ columns: '2 auto' }}>
          <li>MongoDB</li>
          <li>Webpack</li>
          <li>Eslint</li>
          <li>SSH</li>
          <li>Prettier</li>
        </ul>
      </PortfolioContent>
      <Divider />
      <PortfolioContent>
        <h3>Education</h3>
        <h4>University of Cape Coast, Ghana</h4>
        <span className="content-platform">
          Department of Molecular Biology & Biotechnology
        </span>{' '}
        &middot;
        <span className="content-platform"> 2008 &ndash; 2012</span>
      </PortfolioContent>
      <Divider />
      <PortfolioContent>
        <h3>Hobbies</h3>
        <ul style={{ columns: '2 auto' }}>
          <li>Teaching</li>
          <li>Gaming</li>
          <li>Reading</li>
        </ul>
      </PortfolioContent>
    </Fragment>
  );
}

/**
 * renders project page
 */
// function Projects() {
//   return (
//     <ProjectsContainer>
//       <h1>WIP</h1>
//       <p>projects page under construction</p>
//       <p>all other pages, fully built!</p>
//     </ProjectsContainer>
//   );
// }

/**
 * handles page routes
 */
function PageRouter({ postDetail, activateContact, activateTab, activeTab }) {
  useEffect(() => {
    if (activeTab === 'blog') {
      window.scrollTo(0, scrollState.position);
    } else {
      window.scrollTo(0, 0);
    }
  }, [activeTab]);

  const routes = () => {
    switch (activeTab) {
      case 'home':
        return <Home postDetail={postDetail} activateTab={activateTab} />;
      case 'blog':
        return <Articles postDetail={postDetail} activateTab={activateTab} />;
      case 'resume':
        return <Resume />;
      case 'about':
        return (
          <About activateContact={activateContact} activeTab={activeTab} />
        );
      default:
        return null;
    }
  };

  return <Fragment>{routes()}</Fragment>;
}

/**
 * renders markdown post contents
 */
function PostContent({ post, setPost }) {
  const { isDark, store } = useContext(AppContext);
  const theme = useContext(ThemeContext);
  let { id, body, title, author, tags } = post;
  const content = useMarkdown(body);
  const [formattedDate, rawDate] = useFormatDate(post);
  const allPosts = cachedEntries['all articles'] || store;

  // reset scroll
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  });

  const filterPost = id => {
    const post = allPosts.filter(p => p.id === id)[0];
    setPost(post);
  };

  return (
    <Fragment>
      <h1
        style={{
          fontSize: '1.5rem',
          padding: '0 0.5em',
          margin: '2em 0 0',
          fontFamily: '"Open Sans", sans-serif',
          color: isDark ? theme.gray['300'] : theme.gray['800'],
        }}
      >
        {title}
      </h1>
      <SubTitle style={{ padding: '0 1em' }}>
        <time datetime={rawDate}>{formattedDate}</time>
        <span>&middot;</span>
        <div>{author}</div>
      </SubTitle>
      <div style={{ marginTop: '1em', padding: '0 1em' }}>
        {tags.map((tag, idx) => (
          <ArticleTag
            isDark={isDark}
            tag={Array.isArray(tag) ? tag[0] : tag.toLowerCase()}
            key={idx}
          >
            {tag}
          </ArticleTag>
        ))}
      </div>
      <MarkdownContent
        isDark={isDark}
        dangerouslySetInnerHTML={{ __html: content }}
      />
      <PostPagination isDark={isDark}>
        <span
          onClick={() => {
            let isNotFirst = allPosts.some(p => p.id < id);
            if (isNotFirst) {
              filterPost(--id);
            }
          }}
        >
          Previous
        </span>
        <span
          onClick={() => {
            let isNotLast = allPosts.some(p => p.id > id);
            if (isNotLast) {
              filterPost(++id);
            }
          }}
        >
          Next
        </span>
      </PostPagination>
    </Fragment>
  );
}

/**
 * Root App Component
 */
function App() {
  const [store, setStore] = useState(null);
  const [isDark, setisDark] = useState(true);
  const [postActive, setPostActive] = useState(false);
  const [contactActive, setContactActive] = useState(false);
  const [post, setPost] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const pageWidth = usePageWidth();

  useEffect(() => {
    fetchPostEntries();
  }, []);

  const fetchPostEntries = async () => {
    let source = [];
    try {
      const entries = await client.getEntries({
        content_type: 'blogPost',
        order: '-fields.published',
        limit: 4,
      });
      entries.items.forEach(entry => source.push(entry.fields));
      setStore(source);
    } catch (e) {
      console.log(e);
    }
  };

  const handleActiveTab = name => {
    setActiveTab(name);
    window.scrollTo(0, 0);
  };

  const handlePostDetail = post => {
    setPostActive(!postActive);
    setPost(post);
  };

  const handleContactDetail = () => {
    scrollState.position = 0;
    setContactActive(!contactActive);
  };

  const handleLightMode = () => {
    setisDark(!isDark);
  };

  function MobilePage() {
    if (store && store.length > 0) {
      // hide loader
      document.querySelector('.loader').style.display = 'none';

      return (
        <Fragment>
          {postActive || contactActive ? (
            <PostNavBar
              contactActive={contactActive}
              activateContact={handleContactDetail}
              setPostActive={setPostActive}
              activateTab={handleActiveTab}
            />
          ) : (
            <MainNavBar
              activateContact={handleContactDetail}
              activateTab={handleActiveTab}
              lightMode={handleLightMode}
              activeTab={activeTab}
            />
          )}
          <div style={{ height: contactActive ? 0 : 50 }}></div>
          {postActive || contactActive ? (
            <Fragment>
              {contactActive ? (
                <ContactContent />
              ) : (
                <PostContent post={post} setPost={setPost} />
              )}
            </Fragment>
          ) : (
            <Fragment>
              {activeTab === 'all-articles' ? (
                <AllArticles postDetail={handlePostDetail} />
              ) : (
                <PageRouter
                  activeTab={activeTab}
                  postDetail={handlePostDetail}
                  activateTab={handleActiveTab}
                  activateContact={handleContactDetail}
                />
              )}
            </Fragment>
          )}
          {activeTab !== 'home' && (
            <div
              style={{
                flex: 1,
                marginBottom: contactActive ? 0 : '4em',
              }}
            ></div>
          )}
          {!contactActive && (
            <Footer>
              Made with <i className="fa fa-heart"></i> from Ghana <br />
              <span>
                &copy; 2019 &ndash; {new Date().getFullYear()} &middot; Benneth
                Yankey
              </span>
            </Footer>
          )}
        </Fragment>
      );
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <AppContext.Provider
        value={{
          store,
          isDark,
        }}
      >
        <GlobalStyles isDark={isDark} />
        {pageWidth > 768 ? <NonMobilePage /> : MobilePage()}
      </AppContext.Provider>
    </ThemeProvider>
  );
}

// contentful client
const client = contentful.createClient({
  space: 'jzi320sswukf',
  environment: 'master',
  accessToken:
    'ea152cee3c2d857297230cc68e141647ee9cbc5bf7cd178fea6e2c58940f86ca',
});

// render app
ReactDOM.render(<App />, document.getElementById('root'));


//</script>
