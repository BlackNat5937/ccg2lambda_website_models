-- phpMyAdmin SQL Dump
-- version 4.8.0.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le :  lun. 21 mai 2018 à 07:01
-- Version du serveur :  10.1.32-MariaDB
-- Version de PHP :  7.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `visualization`
--
CREATE DATABASE IF NOT EXISTS `visualization` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `visualization`;

-- --------------------------------------------------------

--
-- Structure de la table `answers`
--

DROP TABLE IF EXISTS `answers`;
CREATE TABLE `answers` (
  `answer_code` int(11) NOT NULL,
  `answer_id` int(11) NOT NULL,
  `answer_string` varchar(500) NOT NULL,
  `answer_questioncode` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `questions`
--

DROP TABLE IF EXISTS `questions`;
CREATE TABLE `questions` (
  `question_code` int(11) NOT NULL,
  `question_string` varchar(500) NOT NULL,
  `question_rightanswer` int(11) NOT NULL,
  `question_sentencecode` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `results`
--

DROP TABLE IF EXISTS `results`;
CREATE TABLE `results` (
  `results_code` int(11) NOT NULL,
  `results_timesright` int(11) NOT NULL,
  `results_timesanswered` int(11) NOT NULL,
  `results_questioncode` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `sentences`
--

DROP TABLE IF EXISTS `sentences`;
CREATE TABLE `sentences` (
  `sentence_code` int(11) NOT NULL,
  `sentence_string` varchar(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `answers`
--
ALTER TABLE `answers`
  ADD PRIMARY KEY (`answer_code`),
  ADD KEY `FK_QUESTIONCODE` (`answer_questioncode`);

--
-- Index pour la table `questions`
--
ALTER TABLE `questions`
  ADD PRIMARY KEY (`question_code`),
  ADD KEY `FK_SENTENCECODE` (`question_sentencecode`);

--
-- Index pour la table `results`
--
ALTER TABLE `results`
  ADD PRIMARY KEY (`results_code`),
  ADD KEY `FK_SOURCEQCODE` (`results_questioncode`);

--
-- Index pour la table `sentences`
--
ALTER TABLE `sentences`
  ADD PRIMARY KEY (`sentence_code`),
  ADD UNIQUE KEY `sentence_string` (`sentence_string`);

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `answers`
--
ALTER TABLE `answers`
  ADD CONSTRAINT `FK_QUESTIONCODE` FOREIGN KEY (`answer_questioncode`) REFERENCES `questions` (`question_code`);

--
-- Contraintes pour la table `questions`
--
ALTER TABLE `questions`
  ADD CONSTRAINT `FK_SENTENCECODE` FOREIGN KEY (`question_sentencecode`) REFERENCES `sentences` (`sentence_code`);

--
-- Contraintes pour la table `results`
--
ALTER TABLE `results`
  ADD CONSTRAINT `FK_SOURCEQCODE` FOREIGN KEY (`results_questioncode`) REFERENCES `questions` (`question_code`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
