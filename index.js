const postcssRtlRotate = () => {
  return {
    postcssPlugin: 'postcss-rtl-rotate',
    Once(root) {
      root.walkRules((rule) => {
        // Check if the rule has a class selector that includes a rotate utility
        if (rule.selector.includes('rotate-')) {
          rule.walkDecls('--tw-rotate', () => {
            // Clone the rule to create an RTL-specific version
            const rtlRule = rule.cloneBefore();
            const ltrRule = rule.cloneBefore();

            // Update the selector to target RTL only
            rtlRule.selectors = rtlRule.selectors.map(
              selector => `[dir="rtl"] ${selector}`
            );

            // Modify only the --tw-rotate declaration
            rtlRule.walkDecls('--tw-rotate', rtlDecl => {
              // Extract the rotation value and negate it for RTL
              const currentValue = rtlDecl.value;
              // Handle different rotation value formats
              if (currentValue.includes('deg')) {
                // Extract numeric value and negate it
                const numericValue = parseFloat(currentValue);
                if (!isNaN(numericValue)) {
                  rtlDecl.value = `${-numericValue}deg`;
                }
              } else if (currentValue.includes('turn')) {
                // Handle turn values
                const numericValue = parseFloat(currentValue);
                if (!isNaN(numericValue)) {
                  rtlDecl.value = `${-numericValue}turn`;
                }
              } else if (currentValue.includes('rad')) {
                // Handle radian values
                const numericValue = parseFloat(currentValue);
                if (!isNaN(numericValue)) {
                  rtlDecl.value = `${-numericValue}rad`;
                }
              } else {
                // For simple numeric values, negate them
                const numericValue = parseFloat(currentValue);
                if (!isNaN(numericValue)) {
                  rtlDecl.value = `${-numericValue}`;
                }
              }
            });

            // Remove all other declarations to ensure only the necessary changes are made
            rtlRule.walkDecls(rtlDecl => {
              if (rtlDecl.prop !== '--tw-rotate') {
                rtlDecl.remove();
              }
            });

            // Update the selector to target LTR only
            ltrRule.selectors = ltrRule.selectors.map(
              selector => `[dir="ltr"] ${selector}`
            );

            // LTR rule keeps the original value (no modification needed)
            // The value is already correct for LTR

            // Remove all other declarations to ensure only the necessary changes are made
            ltrRule.walkDecls(ltrDecl => {
              if (ltrDecl.prop !== '--tw-rotate') {
                ltrDecl.remove();
              }
            });

            // Remove the --tw-rotate declaration from the original rule
            rule.walkDecls('--tw-rotate', decl => {
              decl.remove();
            });

            // Remove the original rule if it becomes empty
            if (rule.nodes.length === 0) {
              rule.remove();
            }
          });
        }
      });
    },
  };
};

postcssRtlRotate.postcss = true;

module.exports = postcssRtlRotate;
