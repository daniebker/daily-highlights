exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
  if (stage === "build-html") {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /react-mobile-picker-scroll/,
            use: loaders.null(),
          },
        ],
      },
    })
  }
}
