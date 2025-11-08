using Xunit;

namespace ExpenseTrackerAPI.Tests
{
    public class MathTests
    {
        [Fact]
        public void Addition_Works()
        {
            int a = 2;
            int b = 3;
            int result = a + b;
            Assert.Equal(5, result);
        }
    }
}
