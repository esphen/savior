export default `
  h2, h3 {
    display: inline;
  }

  img {
    object-fit: cover;
  }

  td:last-child {
    word-break: break-word;
  }

  iframe {
    width: 100%;
    height: 500px;
    border: 0;
  }

  summary {
    cursor: pointer;
  }

  .summary .status {
    font-size: 4rem;
  }

  .status.ok {
    color: #21ba45;
  }

  .status.failed {
    color: #db2828;
  }

  .status.other {
    color: #767676;
  }

  .summary img {
    height: 150px !important;
  }

  .response pre {
    white-space: pre-wrap;
    word-wrap: break-word;
  }
`;
