import styles from "./Logo.module.css";

export interface LogoProps {
  animationOnHover: boolean;
  isLoader: boolean;
}

const Logo = ({ animationOnHover, isLoader }: LogoProps) => {
  return (
    <svg
      width="256"
      height="256"
      viewBox="0 0 256 256"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      data-loading={isLoader}
      data-hover={animationOnHover}
      className={styles.logo}
    >
      <g className={styles.star}>
        <path
          d="M112 112L128 64L144 112L192 128L144 144L128 192L112 144L64 128L112 112Z"
          className={styles.primary}
        />
      </g>
      <g className={styles.primaryGroup}>
        <path
          d="M255.229 113.906C255.736 118.535 256 123.237 256 128C256 154.698 247.825 179.486 233.843 200H162.911C170.981 196.08 178.294 190.843 184.568 184.568L255.229 113.906Z"
          className={styles.primary}
        />
        <path
          d="M128 0C154.698 0 179.486 8.17547 200 22.1572V93.0889C196.08 85.0186 190.843 77.7063 184.568 71.4316L113.906 0.769531C118.535 0.262609 123.237 0 128 0Z"
          className={styles.primary}
        />
        <path
          d="M93.0889 56C85.0186 59.9203 77.7063 65.157 71.4316 71.4316L0.769531 142.093C0.262678 137.465 0 132.763 0 128C0 101.302 8.17547 76.5139 22.1572 56H93.0889Z"
          className={styles.primary}
        />
        <path
          d="M56 162.91C59.9204 170.981 65.1568 178.293 71.4316 184.568L142.093 255.229C137.465 255.736 132.763 256 128 256C101.302 256 76.514 247.824 56 233.842V162.91Z"
          className={styles.primary}
        />
      </g>
      <g className={styles.secondaryGroup}>
        <path
          d="M208 28.0752C231.339 46.7848 247.982 73.5013 253.764 104.06L203.602 154.222C206.45 146.007 208 137.184 208 128V28.0752Z"
          className={styles.secondary}
        />
        <path
          d="M154.222 52.3975C146.007 49.5487 137.184 48 128 48H28.0762C46.7858 24.6611 73.5015 8.01697 104.06 2.23535L154.222 52.3975Z"
          className={styles.secondary}
        />
        <path
          d="M101.777 203.602C109.992 206.451 118.815 208 128 208H227.924C209.214 231.339 182.498 247.982 151.939 253.764L101.777 203.602Z"
          className={styles.secondary}
        />
        <path
          d="M52.3975 101.777C49.5485 109.992 48 118.815 48 128V227.924C24.6608 209.214 8.01681 182.498 2.23535 151.939L52.3975 101.777Z"
          className={styles.secondary}
        />
      </g>
    </svg>
  );
};
export default Logo;
