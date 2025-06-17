import { Box, Stack } from "@mui/material";
import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import comicCardBg from "../../assets/images/backgrounds/comic-card-bg.webp";
import Row from "../utility/Row";
import MessageBox from "./MessageBox";
import { ChevronDown } from "lucide-react";

interface ComicCardProps {
  image: string;
  messageContent: React.ReactNode;
  messagePosition: { left?: number; right?: number };
  imagePosition: { left?: number; right?: number };
}

const ComicCard: React.FC<ComicCardProps> = ({
  image,
  messageContent,
  imagePosition,
  messagePosition,
}) => {
  const { ref, inView } = useInView({
    threshold: 0.9, // Trigger when 30% visible
    triggerOnce: true, // Only trigger once
  });

  const containerVariants = {
    hidden: { opacity: 0.3 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.1,
      },
    },
  };

  const imageVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 50,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.6,
        type: "spring",
        bounce: 0.6,
      },
    },
  };

  const messageBoxVariants = {
    hidden: {
      opacity: 0,
      scale: 0.9,
      x: messagePosition.left ? -30 : 30,
    },
    visible: {
      opacity: 1,
      scale: 1,
      x: 0,
      transition: {
        duration: 0.5,
        delay: 1,
        ease: "easeOut",
      },
    },
  };

  // Return a placeholder div with ref for intersection observer

  if (!inView) {
    return (
      <Box position={"relative"}>
        <motion.div
          initial={{ y: 0 }}
          animate={{ y: [0, -10, 0] }}
          transition={{
            duration: 1,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            left: "48%",
            top: "20px",
          }}
        >
          <ChevronDown />
        </motion.div>
        <Box
          ref={ref}
          sx={{
            minHeight: "350px",
            background: `url(${comicCardBg})`,
            backgroundSize: "cover",
            color: "#000",
            overflow: "hidden",
            opacity: 0.3, // Make it semi-transparent when not in view
          }}
        ></Box>
      </Box>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible" // Changed from whileInView to animate since we're controlling visibility
      viewport={{ once: true, amount: 0.8 }}
    >
      <Stack
        sx={{
          background: `url(${comicCardBg})`,
          backgroundSize: "cover",
          color: "#000",
          overflow: "hidden",
        }}
      >
        {/* Message Row */}
        <Row
          sx={{
            justifyContent: messagePosition.left ? "start" : "end",
            marginTop: "45px",
          }}
        >
          <motion.div variants={messageBoxVariants}>
            <MessageBox
              position={messagePosition.left ? "LEFT" : "RIGHT"}
              messageContent={<div>{messageContent}</div>}
              sx={{
                marginRight: `${messagePosition.right}px`,
                marginLeft: `${messagePosition.left}px`,
              }}
            />
          </motion.div>
        </Row>

        {/* Image Row */}
        <Row
          sx={{
            justifyContent: imagePosition.left ? "start" : "end",
            marginTop: "24px",
          }}
        >
          <motion.div variants={imageVariants} style={{ height: "250px" }}>
            <Box
              component="img"
              src={image}
              sx={{
                height: "100%",
                marginRight: `${imagePosition.right}px`,
                marginLeft: `${imagePosition.left}px`,
              }}
            />
          </motion.div>
        </Row>
      </Stack>
    </motion.div>
  );
};

export default ComicCard;
